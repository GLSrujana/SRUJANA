using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class AgentCommissionRepository : IAgentCommissionRepository
    {
        private readonly InsuranceDbContext _db;

        public AgentCommissionRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public Task<List<AgentCommission>> GetByAgentIdAsync(int agentId)
            => _db.AgentCommissions
                .Where(c => c.AgentId == agentId)
                .OrderByDescending(c => c.Id)
                .ToListAsync();

        public Task<List<AgentCommission>> GetAllAsync()
            => _db.AgentCommissions
                .OrderByDescending(c => c.Id)
                .ToListAsync();

        public Task<AgentCommission?> GetByIdAsync(int id)
            => _db.AgentCommissions.FirstOrDefaultAsync(c => c.Id == id);

        public async Task AddAsync(AgentCommission commission)
        {
            await _db.AgentCommissions.AddAsync(commission);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}