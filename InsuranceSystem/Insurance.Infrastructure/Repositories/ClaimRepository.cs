using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly InsuranceDbContext _db;
        public ClaimRepository(InsuranceDbContext db) => _db = db;

        public async Task AddAsync(Claim claim) => await _db.Claims.AddAsync(claim);

        public Task<Claim?> GetByIdAsync(int id) => _db.Claims.FirstOrDefaultAsync(c => c.Id == id);

        public Task<List<Claim>> GetByCustomerAsync(int customerId)
            => _db.Claims
                 .Include(c => c.Customer)
                 .Include(c => c.ActivePolicy)
                    .ThenInclude(p => p.Payments)
                 .Where(c => c.CustomerId == customerId)
                 .OrderByDescending(c => c.Id)
                 .ToListAsync();

        public Task<List<Claim>> GetByStatusAsync(ClaimStatus status)
            => _db.Claims
                 .Include(c => c.Customer)
                 .Include(c => c.ActivePolicy)
                    .ThenInclude(p => p.Payments)
                 .Where(c => c.Status == status)
                 .OrderByDescending(c => c.Id)
                 .ToListAsync();

        public Task<List<Claim>> GetAllAsync()
            => _db.Claims
                 .Include(c => c.Customer)
                 .Include(c => c.ActivePolicy)
                    .ThenInclude(p => p.Payments)
                 .OrderByDescending(c => c.Id)
                 .ToListAsync();

        public async Task<List<int>> GetClaimsOfficerUserIdsAsync()
        {
            var roleId = await _db.Roles
                .Where(r => r.Name == "ClaimsOfficer")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            if (roleId == 0) return new List<int>();

            return await _db.Users
                .Where(u => u.RoleId == roleId)
                .Select(u => u.Id)
                .ToListAsync();
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}