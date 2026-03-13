using Insurance.Application.DTOs.PolicyApplications;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyApplicationService
    {
        Task<PolicyApplicationResponseDto> SelectPolicyAsync(int customerId, SelectPolicyDto dto);
        Task<List<PolicyApplicationResponseDto>> GetMyApplicationsAsync(int customerId);

        Task<List<PolicyApplicationResponseDto>> GetPendingAsync(); // admin
        Task<PolicyApplicationResponseDto> ApproveAsync(int applicationId, DTOs.PolicyApplications.ApprovePolicyDto? dto = null); // admin
        Task<PolicyApplicationResponseDto> RejectAsync(int applicationId);  // admin
    }
}