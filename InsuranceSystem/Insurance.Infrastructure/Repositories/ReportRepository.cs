using Insurance.Application.DTOs.Reports;
using Insurance.Application.Interfaces;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Insurance.Domain.Enums;

namespace Insurance.Infrastructure.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly InsuranceDbContext _db;

        public ReportRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public async Task<AdminSummaryDto> GetAdminSummaryAsync()
        {
            var totalUsers = await _db.Users.CountAsync();

            var customerRoleId = await _db.Roles.Where(r => r.Name == "Customer").Select(r => r.Id).FirstOrDefaultAsync();
            var agentRoleId = await _db.Roles.Where(r => r.Name == "Agent").Select(r => r.Id).FirstOrDefaultAsync();

            var totalCustomers = customerRoleId == 0 ? 0 : await _db.Users.CountAsync(u => u.RoleId == customerRoleId);
            var totalAgents = agentRoleId == 0 ? 0 : await _db.Users.CountAsync(u => u.RoleId == agentRoleId);

            var totalRequests = await _db.InsuranceRequests.CountAsync();
            var assignedRequests = await _db.InsuranceRequests.CountAsync(r => r.AssignedAgentId != null);

            
            var totalApps = await _db.PolicyApplications.CountAsync();
            var approvedApps = await _db.PolicyApplications.CountAsync(a => a.Status == ApplicationStatus.ApprovedByAdmin);
            
            var totalPolicies = await _db.ActivePolicies.CountAsync();
            var totalPayments = await _db.Payments.CountAsync();
            var totalPaymentAmount = await _db.Payments
                .Where(p => p.Status == PaymentStatus.Paid)
                .SumAsync(p => (decimal?)p.Amount) ?? 0m;

            var totalCommission = await _db.AgentCommissions.SumAsync(c => (decimal?)c.CommissionAmount) ?? 0m;

            var totalClaims = await _db.Claims.CountAsync();
            var pendingClaims = await _db.Claims.CountAsync(c => c.Status == ClaimStatus.Submitted);
            var approvedClaims = await _db.Claims.CountAsync(c => c.Status == ClaimStatus.Approved);
            var rejectedClaims = await _db.Claims.CountAsync(c => c.Status == ClaimStatus.Rejected);

            // Get event types from Active Policies (not all requests) - Optimized Projection
            var policiesByEventType = await _db.ActivePolicies
                .AsNoTracking()
                .Where(ap => ap.PolicyApplication.InsuranceRequest.RequestEventDetail != null)
                .Select(ap => ap.PolicyApplication.InsuranceRequest.RequestEventDetail!.EventType)
                .GroupBy(e => e)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Type, x => x.Count);

            // Calculate Revenue by Month for the current year
            var currentYear = DateTime.UtcNow.Year;
            var payments = await _db.Payments
                .Where(p => p.Status == PaymentStatus.Paid && p.PaidAtUtc != null && p.PaidAtUtc.Value.Year == currentYear)
                .ToListAsync();

            var revByMonth = payments
                .GroupBy(p => p.PaidAtUtc!.Value.Month)
                .ToDictionary(
                    g => new DateTime(currentYear, g.Key, 1).ToString("MMM"),
                    g => g.Sum(p => p.Amount)
                );

            // Seed missing months to 0 for a complete chart
            for (int i = 1; i <= 12; i++)
            {
                var monthName = new DateTime(currentYear, i, 1).ToString("MMM");
                if (!revByMonth.ContainsKey(monthName))
                {
                    revByMonth[monthName] = 0;
                }
            }

            return new AdminSummaryDto
            {
                TotalUsers = totalUsers,
                TotalCustomers = totalCustomers,
                TotalAgents = totalAgents,
                TotalRequests = totalRequests,
                AssignedRequests = assignedRequests,
                TotalPolicyApplications = totalApps,
                ApprovedApplications = approvedApps,
                TotalActivePolicies = totalPolicies,
                TotalPayments = totalPayments,
                TotalPaymentAmount = totalPaymentAmount,
                TotalCommissionGenerated = totalCommission,
                TotalClaims = totalClaims,
                PendingClaims = pendingClaims,
                ApprovedClaims = approvedClaims,
                RejectedClaims = rejectedClaims,
                RequestsByEventType = policiesByEventType,
                RevenueByMonth = revByMonth
            };
        }

        /// <summary>
        /// Cleans up stale Payment and AgentCommission records and recreates them
        /// based on actual ActivePolicies. Each active policy gets exactly 1 Payment
        /// and 1 AgentCommission (10% of premium).
        /// </summary>
        public async Task SyncPaymentsAndCommissionsAsync()
        {
            const decimal commissionRate = 0.10m;

            // Step 1: Remove all existing commissions (depends on payments)
            _db.AgentCommissions.RemoveRange(_db.AgentCommissions);
            await _db.SaveChangesAsync();

            // Step 2: Remove all existing payments
            _db.Payments.RemoveRange(_db.Payments);
            await _db.SaveChangesAsync();

            // Step 3: Get all active policies
            var activePolicies = await _db.ActivePolicies.ToListAsync();

            foreach (var policy in activePolicies)
            {
                // Create Payment for this policy
                var payment = new Insurance.Domain.Entities.Payment
                {
                    ActivePolicyId = policy.Id,
                    Amount = policy.TotalPremium,
                    Status = PaymentStatus.Paid,
                    PaidAtUtc = policy.StartDateUtc,
                    TransactionReference = $"TXN-{policy.StartDateUtc:yyyyMMddHHmmss}-{policy.Id}",
                    PaymentMethod = "Policy Premium"
                };

                await _db.Payments.AddAsync(payment);
                await _db.SaveChangesAsync(); // Save to get payment.Id

                // Create AgentCommission for this policy
                var commission = new Insurance.Domain.Entities.AgentCommission
                {
                    AgentId = policy.AgentId,
                    ActivePolicyId = policy.Id,
                    PaymentId = payment.Id,
                    CommissionRate = commissionRate,
                    CommissionAmount = Math.Round(policy.TotalPremium * commissionRate, 2),
                    IsPaid = true,
                    GeneratedAtUtc = policy.StartDateUtc,
                    PaidAtUtc = policy.StartDateUtc
                };

                await _db.AgentCommissions.AddAsync(commission);
            }

            await _db.SaveChangesAsync();
        }
    }
}