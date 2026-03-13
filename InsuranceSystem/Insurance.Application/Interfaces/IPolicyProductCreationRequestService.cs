using Insurance.Application.DTOs.PolicyCreationRequests;
using Insurance.Application.DTOs.PolicyProducts;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyProductCreationRequestService
    {
        Task<object> CreateAsync(int agentId, CreatePolicyCreationRequestDto dto);
        Task<object> GetPendingAsync();
        Task<object> AdminCreatePolicyAsync(int adminId, int creationRequestId, CreatePolicyProductDto dto);
    }
}