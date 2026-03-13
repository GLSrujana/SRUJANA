using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyApplicationRepository
    {
        Task<bool> ExistsForRequestAsync(int insuranceRequestId);
        Task AddAsync(PolicyApplication app);
        Task<PolicyApplication?> GetByIdAsync(int id);
        Task<List<PolicyApplication>> GetByCustomerAsync(int customerId);
        Task<List<PolicyApplication>> GetByStatusAsync(ApplicationStatus status);
        Task SaveChangesAsync();
    }
}