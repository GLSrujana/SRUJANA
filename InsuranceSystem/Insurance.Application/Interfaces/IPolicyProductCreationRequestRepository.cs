using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyProductCreationRequestRepository
    {
        Task AddAsync(PolicyProductCreationRequest req);
        Task<PolicyProductCreationRequest?> GetByIdAsync(int id);
        Task<List<PolicyProductCreationRequest>> GetPendingAsync();
        Task SaveChangesAsync();

        Task<int?> GetSingleAdminUserIdAsync();
    }
}