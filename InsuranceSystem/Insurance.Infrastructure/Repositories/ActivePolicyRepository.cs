using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class ActivePolicyRepository : IActivePolicyRepository
    {
        private readonly InsuranceDbContext _db;
        public ActivePolicyRepository(InsuranceDbContext db) => _db = db;

        public async Task AddAsync(ActivePolicy policy) => await _db.ActivePolicies.AddAsync(policy);

        public Task<ActivePolicy?> GetByApplicationIdAsync(int applicationId)
            => _db.ActivePolicies.AsNoTracking().FirstOrDefaultAsync(p => p.PolicyApplicationId == applicationId);

        public Task<ActivePolicy?> GetByIdAsync(int id)
            => _db.ActivePolicies.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

        public async Task<List<ActivePolicy>> GetByCustomerAsync(int customerId)
        {
            var policies = await _db.ActivePolicies
                   .AsNoTracking()
                   .AsSplitQuery()
                   .Where(p => p.CustomerId == customerId)
                   .Include(p => p.Agent)
                   .Include(p => p.Payments)
                   .Include(p => p.PolicyApplication)
                       .ThenInclude(pa => pa.PolicyProduct)
                   .Include(p => p.PolicyApplication)
                       .ThenInclude(pa => pa.InsuranceRequest)
                   .Include(p => p.Claims)
                       .ThenInclude(c => c.ReviewedByClaimsOfficer)
                   .OrderByDescending(p => p.Id)
                   .ToListAsync();

            await PopulateEventDetailsAsync(policies);
            return policies;
        }

        public async Task<List<ActivePolicy>> GetAllAsync()
        {
            var policies = await _db.ActivePolicies
                   .AsNoTracking()
                   .AsSplitQuery()
                   .Include(p => p.Customer)
                   .Include(p => p.Agent)
                   .Include(p => p.Payments)
                   .Include(p => p.PolicyApplication)
                       .ThenInclude(pa => pa.PolicyProduct)
                   .Include(p => p.PolicyApplication)
                       .ThenInclude(pa => pa.InsuranceRequest)
                   .Include(p => p.Claims)
                       .ThenInclude(c => c.ReviewedByClaimsOfficer)
                   .OrderByDescending(p => p.Id)
                   .ToListAsync();

            await PopulateEventDetailsAsync(policies);
            return policies;
        }

        private async Task PopulateEventDetailsAsync(List<ActivePolicy> policies)
        {
            var requests = policies
                .Where(p => p.PolicyApplication?.InsuranceRequest != null)
                .Select(p => p.PolicyApplication.InsuranceRequest)
                .Distinct()
                .ToList();

            var reqIds = requests.Select(r => r.Id).ToList();
            if (!reqIds.Any()) return;

            var details = await _db.RequestEventDetails
                .Where(d => reqIds.Contains(d.InsuranceRequestId))
                .Select(d => new RequestEventDetail {
                    Id = d.Id,
                    InsuranceRequestId = d.InsuranceRequestId,
                    EventType = d.EventType,
                    EventDate = d.EventDate,
                    DurationInHours = d.DurationInHours,
                    Location = d.Location,
                    ExpectedAttendees = d.ExpectedAttendees,
                    EventBudget = d.EventBudget,
                    IsOutdoorVenue = d.IsOutdoorVenue,
                    HasFireworks = d.HasFireworks,
                    HasVipPresence = d.HasVipPresence,
                    AlcoholServed = d.AlcoholServed,
                    SpecialNotes = d.SpecialNotes,
                    DocumentType = d.DocumentType
                })
                .ToListAsync();

            foreach (var r in requests)
            {
                r.RequestEventDetail = details.FirstOrDefault(d => d.InsuranceRequestId == r.Id);
            }
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}