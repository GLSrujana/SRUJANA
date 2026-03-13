using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class PolicySuggestionRepository : IPolicySuggestionRepository
    {
        private readonly InsuranceDbContext _db;

        public PolicySuggestionRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public async Task AddRangeAsync(List<PolicySuggestion> suggestions)
            => await _db.PolicySuggestions.AddRangeAsync(suggestions);

        public Task<List<PolicySuggestion>> GetByRequestIdAsync(int requestId)
            => _db.PolicySuggestions
                .Include(s => s.PolicyProduct)
                .Where(s => s.InsuranceRequestId == requestId)
                .OrderByDescending(s => s.Id)
                .ToListAsync();

        public Task SaveChangesAsync()
            => _db.SaveChangesAsync();

        public Task DeleteRangeAsync(List<PolicySuggestion> suggestions)
        {
            _db.PolicySuggestions.RemoveRange(suggestions);
            return Task.CompletedTask;
        }
    }
}