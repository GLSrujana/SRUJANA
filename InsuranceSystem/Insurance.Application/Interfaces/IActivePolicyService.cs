using Insurance.Application.DTOs.ActivePolicies;

namespace Insurance.Application.Interfaces
{
    public interface IActivePolicyService
    {
        Task<List<ActivePolicyResponseDto>> GetMyPoliciesAsync(int customerId);
        Task<List<AdminActivePolicyDto>> GetAllForAdminAsync();
    }
}