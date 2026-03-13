using Insurance.Application.DTOs.PolicyProducts;

namespace Insurance.Application.Interfaces
{
    public interface IPolicyProductService
    {
        Task<PolicyProductResponseDto> CreateAsync(int adminId, CreatePolicyProductDto dto);
        Task<List<PolicyProductResponseDto>> GetAllAsync(bool? isActive);
        Task<PolicyProductResponseDto?> GetByIdAsync(int id);
        Task<PolicyProductResponseDto> UpdateAsync(int id, UpdatePolicyProductDto dto);
        Task<PolicyProductResponseDto> SetActiveAsync(int id, bool isActive);
    }
}