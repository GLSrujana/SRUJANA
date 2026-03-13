using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Interfaces
{
    public interface IClaimRepository
    {
        Task AddAsync(Claim claim);
        Task<Claim?> GetByIdAsync(int id);
        Task<List<Claim>> GetByCustomerAsync(int customerId);
        Task<List<Claim>> GetByStatusAsync(ClaimStatus status);
        Task<List<Claim>> GetAllAsync();
        Task<List<int>> GetClaimsOfficerUserIdsAsync();
        Task SaveChangesAsync();
    }
}