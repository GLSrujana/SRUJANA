using Insurance.Application.DTOs.Claims;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    public class ClaimService : IClaimService
    {
        private readonly IClaimRepository _claimRepo;
        private readonly IActivePolicyRepository _policyRepo;
        private readonly INotificationService _notif;

        public ClaimService(
            IClaimRepository claimRepo,
            IActivePolicyRepository policyRepo,
            INotificationService notif)
        {
            _claimRepo = claimRepo;
            _policyRepo = policyRepo;
            _notif = notif;
        }

        public async Task<ClaimResponseDto> CreateAsync(int customerId, CreateClaimDto dto)
        {
            var policy = await _policyRepo.GetByIdAsync(dto.ActivePolicyId)
                         ?? throw new Exception("Active policy not found.");

            if (policy.CustomerId != customerId)
                throw new Exception("You cannot raise claim for someone else's policy.");

            var claim = new Claim
            {
                ActivePolicyId = dto.ActivePolicyId,
                CustomerId = customerId,
                ClaimReason = dto.ClaimReason.Trim(),
                ClaimAmountRequested = dto.ClaimAmountRequested,
                Status = ClaimStatus.Submitted,
                SubmittedAtUtc = DateTime.UtcNow
            };

            await _claimRepo.AddAsync(claim);
            await _claimRepo.SaveChangesAsync();

            var claimRef = $"CLM-{claim.Id.ToString().PadLeft(4, '0')}";
            var policyRef = $"POL-{claim.ActivePolicyId}";

            // ✅ Notify ALL ClaimsOfficers
            var officerIds = await _claimRepo.GetClaimsOfficerUserIdsAsync();
            foreach (var oid in officerIds)
            {
                await _notif.CreateAsync(
                    userId: oid,
                    title: "New claim submitted",
                    message: $"A new claim ({claimRef}) was submitted for policy {policyRef}.",
                    type: "ClaimUpdate"
                );
            }

            // ✅ Notify Customer
            await _notif.CreateAsync(
                userId: claim.CustomerId,
                title: "Claim Submitted Successfully",
                message: $"Your claim ({claimRef}) for policy {policyRef} has been received and is pending review.",
                type: "ClaimUpdate"
            );

            return Map(claim);
        }

        public async Task<List<ClaimResponseDto>> GetMyClaimsAsync(int customerId)
        {
            var list = await _claimRepo.GetByCustomerAsync(customerId);
            return list.Select(Map).ToList();
        }

        public async Task<List<ClaimResponseDto>> GetPendingAsync()
        {
            var list = await _claimRepo.GetByStatusAsync(ClaimStatus.Submitted);
            return list.Select(Map).ToList();
        }

        public async Task<ClaimResponseDto> ReviewAsync(int officerId, int claimId, ReviewClaimDto dto)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId)
                        ?? throw new Exception("Claim not found.");

            if (dto.Status == ClaimStatus.Submitted)
                throw new Exception("Invalid status update.");

            claim.Status = dto.Status;
            claim.ReviewedByClaimsOfficerId = officerId;
            claim.ReviewedAtUtc = DateTime.UtcNow;
            claim.OfficerRemarks = dto.OfficerRemarks;

            if (dto.Status == ClaimStatus.Approved || dto.Status == ClaimStatus.Settled)
                claim.ApprovedSettlementAmount = dto.ApprovedSettlementAmount;

            await _claimRepo.SaveChangesAsync();

            var claimRef = $"CLM-{claim.Id.ToString().PadLeft(4, '0')}";

            // ✅ Notify Customer: claim updated
            await _notif.CreateAsync(
                userId: claim.CustomerId,
                title: "Claim status updated",
                message: $"Your claim ({claimRef}) status has been updated to: {claim.Status}.",
                type: "ClaimUpdate"
            );

            return Map(claim);
        }

        public async Task<List<ClaimResponseDto>> GetAllAsync()
        {
            var list = await _claimRepo.GetAllAsync();
            return list.Select(Map).ToList();
        }

        private static ClaimResponseDto Map(Claim c) 
        {
            var paidCount = c.ActivePolicy?.Payments?.Count(x => x.Status == PaymentStatus.Paid) ?? 0;
            var totalCount = 0;
            if (c.ActivePolicy?.PaymentOption == "Monthly") totalCount = 12;
            else if (c.ActivePolicy?.PaymentOption == "SixMonths") totalCount = 2;
            else totalCount = 1;

            var risk = CalculateRisk(c);

            return new ClaimResponseDto
            {
                Id = c.Id,
                ActivePolicyId = c.ActivePolicyId,
                PolicyNumber = c.ActivePolicy?.PolicyNumber ?? string.Empty,
                CustomerId = c.CustomerId,
                CustomerName = c.Customer?.FullName ?? string.Empty,
                Status = c.Status,
                ClaimReason = c.ClaimReason,
                ClaimAmountRequested = c.ClaimAmountRequested,
                ApprovedSettlementAmount = c.ApprovedSettlementAmount,
                OfficerRemarks = c.OfficerRemarks,
                SubmittedAtUtc = c.SubmittedAtUtc,
                PaymentOption = c.ActivePolicy?.PaymentOption ?? "Unknown",
                TotalInstallments = totalCount,
                PaidInstallments = paidCount,
                RiskScore = risk.Score,
                RiskLevel = risk.Level,
                RiskAnalysis = risk.Analysis
            };
        }

        private static (int Score, string Level, string Analysis) CalculateRisk(Claim c)
        {
            int score = 10; // Base score
            var analysis = new List<string>();

            // 1. Payment Progress Factor
            var paidProgress = c.ActivePolicy?.Payments?.Count(x => x.Status == PaymentStatus.Paid) ?? 0;
            if (paidProgress == 0)
            {
                score += 40;
                analysis.Add("High Priority: ZERO premium payments received.");
            }
            else if (paidProgress < 2 && c.ActivePolicy?.PaymentOption == "Monthly")
            {
                score += 20;
                analysis.Add("Warning: Very early claim with only one installment paid.");
            }

            // 2. Claim Amount relative to Policy Coverage (simulated)
            // Assuming coverage is roughly 10x the premium for demo
            var estimatedCoverage = (c.ActivePolicy?.TotalPremium ?? 1000) * 10;
            if (c.ClaimAmountRequested > (estimatedCoverage * 0.8m))
            {
                score += 30;
                analysis.Add("High Risk: Claim amount exceeds 80% of estimated coverage.");
            }

            // 3. Reason Analysis (Basic keyword matching)
            var reason = c.ClaimReason.ToLower();
            if (reason.Contains("emergency") || reason.Contains("injury"))
            {
                score -= 5;
                analysis.Add("Urgency detected in claim reason.");
            }
            if (reason.Length < 10)
            {
                score += 15;
                analysis.Add("Nonsense/Short reason provided.");
            }

            // Clamp score
            score = Math.Min(100, Math.Max(0, score));

            string level = score > 70 ? "Critical" : (score > 40 ? "Elevated" : "Low");
            string analysisStr = analysis.Count > 0 ? string.Join(" | ", analysis) : "Standard patterns detected.";

            return (score, level, analysisStr);
        }
    }
}