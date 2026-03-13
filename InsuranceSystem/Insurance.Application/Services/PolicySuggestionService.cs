using Insurance.Application.DTOs.PolicySuggestions;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;
using System.Linq;

namespace Insurance.Application.Services
{
    public class PolicySuggestionService : IPolicySuggestionService
    {
        private readonly IPolicySuggestionRepository _suggestionRepo;
        private readonly IPolicyProductRepository _productRepo;
        private readonly IInsuranceRequestRepository _requestRepo;
        private readonly INotificationService _notif;

        public PolicySuggestionService(
            IPolicySuggestionRepository suggestionRepo,
            IPolicyProductRepository productRepo,
            IInsuranceRequestRepository requestRepo,
            INotificationService notif)
        {
            _suggestionRepo = suggestionRepo;
            _productRepo = productRepo;
            _requestRepo = requestRepo;
            _notif = notif;
        }

        public async Task<List<PolicySuggestionResponseDto>> CreateSuggestionsAsync(int agentId, CreatePolicySuggestionDto dto)
        {
            // Validate request exists
            var request = await _requestRepo.GetByIdAsync(dto.InsuranceRequestId)
                          ?? throw new Exception("Insurance request not found.");

            // Optional: ensure this agent is actually assigned to this request
            if (request.AssignedAgentId != agentId)
                throw new Exception("You are not assigned to this request.");

            // Allow re-submission if already sent or needs info
            var allowedStatuses = new[] { 
                Insurance.Domain.Enums.RequestStatus.Assigned, 
                Insurance.Domain.Enums.RequestStatus.SuggestionsSent,
                Insurance.Domain.Enums.RequestStatus.InfoRequired
            };

            if (!allowedStatuses.Contains(request.Status))
                throw new Exception($"Cannot send suggestions for request in {request.Status} status.");

            if (dto.Suggestions == null || dto.Suggestions.Count == 0)
                throw new Exception("At least one policy product must be suggested.");

            // Clear existing suggestions for this request to allow "Update/Resume"
            var existing = await _suggestionRepo.GetByRequestIdAsync(dto.InsuranceRequestId);
            if (existing.Any())
            {
                await _suggestionRepo.DeleteRangeAsync(existing);
                await _suggestionRepo.SaveChangesAsync();
            }

            // Create suggestion rows
            var suggestions = dto.Suggestions.Select(s => new PolicySuggestion
            {
                InsuranceRequestId = dto.InsuranceRequestId,
                PolicyProductId = s.PolicyProductId,
                SuggestedByAgentId = agentId,
                SuggestionRemarks = dto.SuggestionRemarks,
                PremiumMonthly = s.PremiumMonthly,
                Premium6Months = s.Premium6Months,
                PremiumYearly = s.PremiumYearly,
                SuggestedAtUtc = DateTime.UtcNow
            }).ToList();

            await _suggestionRepo.AddRangeAsync(suggestions);
            await _suggestionRepo.SaveChangesAsync();


            // ✅ Notify Customer: Suggestions available
            await _notif.CreateAsync(
                userId: request.CustomerId,
                title: "Policy suggestions available",
                message: $"New policy suggestions are available for your request (Request ID: {dto.InsuranceRequestId}).",
                type: "PolicyUpdate"
            );

            // ✅ Update request status to SuggestionsSent
            request.Status = Insurance.Domain.Enums.RequestStatus.SuggestionsSent;
            await _requestRepo.SaveChangesAsync();

            // Return with product info
            var saved = await _suggestionRepo.GetByRequestIdAsync(dto.InsuranceRequestId);
            return saved.Select(Map).ToList();
        }

        public async Task<List<PolicySuggestionResponseDto>> GetSuggestionsForRequestAsync(int requestId)
        {
            var list = await _suggestionRepo.GetByRequestIdAsync(requestId);
            return list.Select(Map).ToList();
        }

        private static PolicySuggestionResponseDto Map(PolicySuggestion s)
        {
            return new PolicySuggestionResponseDto
            {
                Id = s.Id,
                InsuranceRequestId = s.InsuranceRequestId,
                PolicyProductId = s.PolicyProductId,
                PolicyProductName = s.PolicyProduct?.ProductName ?? "",
                EventTypeSupported = s.PolicyProduct?.EventTypeSupported ?? "",
                BaseRate = s.PolicyProduct?.BaseRate ?? 0,
                MinCoverageAmount = s.PolicyProduct?.MinCoverageAmount ?? 0,
                MaxCoverageAmount = s.PolicyProduct?.MaxCoverageAmount ?? 0,
                SuggestionRemarks = s.SuggestionRemarks,
                PremiumMonthly = s.PremiumMonthly,
                Premium6Months = s.Premium6Months,
                PremiumYearly = s.PremiumYearly,
                SuggestedByAgentId = s.SuggestedByAgentId,
                SuggestedAtUtc = s.SuggestedAtUtc
            };
        }
    }
}