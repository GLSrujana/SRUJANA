using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IActivePolicyRepository
    {
        Task AddAsync(ActivePolicy policy);
        Task<ActivePolicy?> GetByApplicationIdAsync(int applicationId);
        Task<ActivePolicy?> GetByIdAsync(int id);
        Task<List<ActivePolicy>> GetByCustomerAsync(int customerId);
        Task<List<ActivePolicy>> GetAllAsync();
        Task SaveChangesAsync();
    }
}