using Insurance.Application.DTOs.InsuranceRequests;

namespace Insurance.Application.Interfaces
{
    public interface IInsuranceRequestService
    {
        Task<InsuranceRequestResponseDto> CreateRequestAsync(int customerId, CreateInsuranceRequestDto dto);

        Task<List<InsuranceRequestResponseDto>> GetCustomerRequestsAsync(int customerId);

        Task<List<InsuranceRequestResponseDto>> GetUnassignedRequestsAsync();

        Task<bool> AssignAgentAsync(int adminId, AssignAgentDto dto);

        Task<List<InsuranceRequestResponseDto>> GetAgentAssignedRequestsAsync(int agentId);
        Task<InsuranceRequestResponseDto> CreateDraftAsync(int customerId, CreateInsuranceRequestDto dto);
        Task<InsuranceRequestResponseDto> UpdateDraftAsync(int customerId, int requestId, CreateInsuranceRequestDto dto);
        Task<InsuranceRequestResponseDto> SubmitDraftAsync(int customerId, int requestId, CreateInsuranceRequestDto dto);
        Task<bool> UpdateRequestStatusAsync(int agentId, int requestId, Insurance.Domain.Enums.RequestStatus status, string? remarks);
        Task<InsuranceRequestResponseDto?> GetRequestByIdAsync(int userId, int requestId);
    }
}