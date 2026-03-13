using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class PolicyApplicationRepository : IPolicyApplicationRepository
    {
        private readonly InsuranceDbContext _db;

        public PolicyApplicationRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public Task<bool> ExistsForRequestAsync(int insuranceRequestId)
            => _db.PolicyApplications.AnyAsync(a => a.InsuranceRequestId == insuranceRequestId);

        public async Task AddAsync(PolicyApplication app)
            => await _db.PolicyApplications.AddAsync(app);

        public Task<PolicyApplication?> GetByIdAsync(int id)
            => _db.PolicyApplications.FirstOrDefaultAsync(a => a.Id == id);

        public Task<List<PolicyApplication>> GetByCustomerAsync(int customerId)
            => _db.PolicyApplications
                .Where(a => a.CustomerId == customerId)
                .OrderByDescending(a => a.Id)
                .ToListAsync();

        public Task<List<PolicyApplication>> GetByStatusAsync(ApplicationStatus status)
            => _db.PolicyApplications
                .Where(a => a.Status == status)
                .OrderByDescending(a => a.Id)
                .ToListAsync();

        public Task SaveChangesAsync()
            => _db.SaveChangesAsync();
    }
}