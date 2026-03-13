using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IInsuranceRequestRepository
    {
        Task AddRequestAsync(InsuranceRequest request);
        Task SaveChangesAsync();

        Task<InsuranceRequest?> GetByIdAsync(int requestId);
        Task<InsuranceRequest?> GetByIdWithDocumentAsync(int requestId);

        Task<List<InsuranceRequest>> GetUnassignedRequestsAsync();
        Task<List<InsuranceRequest>> GetRequestsAssignedToAgentAsync(int agentId);
        Task<List<InsuranceRequest>> GetRequestsByCustomerAsync(int customerId);

        Task<bool> AssignAgentAsync(int requestId, int agentId, int adminId, string? adminRemarks);

        Task<int?> GetSingleAdminUserIdAsync();
        Task<int?> GetCustomerIdByRequestIdAsync(int requestId);
    }
}