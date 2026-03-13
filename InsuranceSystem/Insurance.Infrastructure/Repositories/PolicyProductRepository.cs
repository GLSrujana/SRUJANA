using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class PolicyProductRepository : IPolicyProductRepository
    {
        private readonly InsuranceDbContext _db;

        public PolicyProductRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(PolicyProduct product)
            => await _db.PolicyProducts.AddAsync(product);

        public Task<PolicyProduct?> GetByIdAsync(int id)
            => _db.PolicyProducts.FirstOrDefaultAsync(p => p.Id == id);

        public Task<List<PolicyProduct>> GetAllAsync(bool? isActive)
        {
            var query = _db.PolicyProducts.AsQueryable();

            if (isActive.HasValue)
                query = query.Where(p => p.IsActive == isActive.Value);

            return query.OrderByDescending(p => p.Id).ToListAsync();
        }

        public Task SaveChangesAsync()
            => _db.SaveChangesAsync();
    }
}