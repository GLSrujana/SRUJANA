using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyProductRepository
    {
        Task AddAsync(PolicyProduct product);
        Task<PolicyProduct?> GetByIdAsync(int id);
        Task<List<PolicyProduct>> GetAllAsync(bool? isActive);
        Task SaveChangesAsync();
    }
}