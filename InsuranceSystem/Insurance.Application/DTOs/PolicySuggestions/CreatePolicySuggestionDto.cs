namespace Insurance.Application.DTOs.PolicySuggestions
{
    public class CreatePolicySuggestionDto
    {
        public int InsuranceRequestId { get; set; }
        public string? SuggestionRemarks { get; set; }
        public List<PolicySuggestionItemDto> Suggestions { get; set; } = new();
    }

    public class PolicySuggestionItemDto
    {
        public int PolicyProductId { get; set; }
        public decimal PremiumMonthly { get; set; }
        public decimal Premium6Months { get; set; }
        public decimal PremiumYearly { get; set; }
    }
}