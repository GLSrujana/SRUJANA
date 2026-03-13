using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly InsuranceDbContext _context;

        public UserRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public Task<bool> EmailExistsAsync(string email)
            => _context.Users.AnyAsync(u => u.Email == email);

        public Task<User?> GetByEmailWithRoleAsync(string email)
            => _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

        public Task<List<User>> GetUsersByRoleAsync(string roleName)
            => _context.Users.Include(u => u.Role).Where(u => u.Role.Name == roleName).ToListAsync();

        public async Task AddAsync(User user)
            => await _context.Users.AddAsync(user);

        public Task SaveChangesAsync()
            => _context.SaveChangesAsync();
    }
}