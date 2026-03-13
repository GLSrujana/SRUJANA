using Insurance.Application.DTOs.Claims;

namespace Insurance.Application.Interfaces
{
    public interface IClaimService
    {
        Task<ClaimResponseDto> CreateAsync(int customerId, CreateClaimDto dto);
        Task<List<ClaimResponseDto>> GetMyClaimsAsync(int customerId);

        Task<List<ClaimResponseDto>> GetPendingAsync(); // ClaimsOfficer
        Task<List<ClaimResponseDto>> GetAllAsync(); // For dashboard analytics
        Task<ClaimResponseDto> ReviewAsync(int officerId, int claimId, ReviewClaimDto dto);
    }
}