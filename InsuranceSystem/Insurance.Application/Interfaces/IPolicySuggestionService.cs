using Insurance.Application.DTOs.PolicySuggestions;

namespace Insurance.Application.Interfaces
{
    public interface IPolicySuggestionService
    {
        Task<List<PolicySuggestionResponseDto>> CreateSuggestionsAsync(int agentId, CreatePolicySuggestionDto dto);
        Task<List<PolicySuggestionResponseDto>> GetSuggestionsForRequestAsync(int requestId);
    }
}