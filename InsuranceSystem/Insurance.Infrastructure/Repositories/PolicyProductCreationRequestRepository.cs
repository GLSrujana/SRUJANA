using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class PolicyProductCreationRequestRepository : IPolicyProductCreationRequestRepository
    {
        private readonly InsuranceDbContext _db;

        public PolicyProductCreationRequestRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(PolicyProductCreationRequest req)
            => await _db.PolicyProductCreationRequests.AddAsync(req);

        public Task<PolicyProductCreationRequest?> GetByIdAsync(int id)
            => _db.PolicyProductCreationRequests
                .Include(x => x.InsuranceRequest)
                .FirstOrDefaultAsync(x => x.Id == id);

        public Task<List<PolicyProductCreationRequest>> GetPendingAsync()
            => _db.PolicyProductCreationRequests
                .Where(x => x.Status == Domain.Enums.PolicyCreationRequestStatus.Pending)
                .OrderByDescending(x => x.RequestedAtUtc)
                .ToListAsync();

        public Task SaveChangesAsync() => _db.SaveChangesAsync();

        public async Task<int?> GetSingleAdminUserIdAsync()
        {
            // assumes Roles table has "Admin"
            var adminRoleId = await _db.Roles
                .Where(r => r.Name == "Admin")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            if (adminRoleId == 0) return null;

            return await _db.Users
                .Where(u => u.RoleId == adminRoleId)
                .Select(u => (int?)u.Id)
                .FirstOrDefaultAsync();
        }
    }
}