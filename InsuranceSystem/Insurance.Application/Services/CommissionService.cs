using Insurance.Application.DTOs.Commissions;
using Insurance.Application.Interfaces;

namespace Insurance.Application.Services
{
    public class CommissionService : ICommissionService
    {
        private readonly IAgentCommissionRepository _repo;

        public CommissionService(IAgentCommissionRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<CommissionDto>> GetMyAsync(int agentId)
        {
            var list = await _repo.GetByAgentIdAsync(agentId);
            return list.Select(Map).ToList();
        }

        public async Task<List<CommissionDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(Map).ToList();
        }

        public async Task MarkPaidAsync(int commissionId)
        {
            var c = await _repo.GetByIdAsync(commissionId) ?? throw new Exception("Commission not found.");
            if (c.IsPaid) return;

            c.IsPaid = true;
            c.PaidAtUtc = DateTime.UtcNow;

            await _repo.SaveChangesAsync();
        }

        private static CommissionDto Map(Insurance.Domain.Entities.AgentCommission c) => new()
        {
            Id = c.Id,
            AgentId = c.AgentId,
            ActivePolicyId = c.ActivePolicyId,
            PaymentId = c.PaymentId,
            CommissionRate = c.CommissionRate,
            CommissionAmount = c.CommissionAmount,
            IsPaid = c.IsPaid,
            GeneratedAtUtc = c.GeneratedAtUtc,
            PaidAtUtc = c.PaidAtUtc
        };
    }
}