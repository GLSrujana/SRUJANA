using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IPolicySuggestionRepository
    {
        Task AddRangeAsync(List<PolicySuggestion> suggestions);
        Task<List<PolicySuggestion>> GetByRequestIdAsync(int requestId);
        Task DeleteRangeAsync(List<PolicySuggestion> suggestions);
        Task SaveChangesAsync();
    }
}