using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly InsuranceDbContext _context;

        public RoleRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public Task<Role?> GetByNameAsync(string roleName)
            => _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
    }
}