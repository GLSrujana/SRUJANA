using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IAgentCommissionRepository
    {
        // CREATE (needed by PaymentService)
        Task AddAsync(AgentCommission commission);

        // READ (tracking APIs)
        Task<List<AgentCommission>> GetByAgentIdAsync(int agentId);
        Task<List<AgentCommission>> GetAllAsync();
        Task<AgentCommission?> GetByIdAsync(int id);

        // SAVE
        Task SaveChangesAsync();
    }
}