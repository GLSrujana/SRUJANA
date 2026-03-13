using Insurance.Application.DTOs.Commissions;

namespace Insurance.Application.Interfaces
{
    public interface ICommissionService
    {
        Task<List<CommissionDto>> GetMyAsync(int agentId);
        Task<List<CommissionDto>> GetAllAsync();          // Admin
        Task MarkPaidAsync(int commissionId);             // Admin
    }
}