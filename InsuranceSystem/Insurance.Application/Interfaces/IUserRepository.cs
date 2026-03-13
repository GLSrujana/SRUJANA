using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> EmailExistsAsync(string email);
        Task<User?> GetByEmailWithRoleAsync(string email);
        Task<List<User>> GetUsersByRoleAsync(string roleName);
        Task AddAsync(User user);
        Task SaveChangesAsync();
    }
}