namespace Insurance.Application.DTOs.PolicySuggestions
{
    public class PolicySuggestionResponseDto
    {
        public int Id { get; set; }
        public int InsuranceRequestId { get; set; }
        public int PolicyProductId { get; set; }
        public string PolicyProductName { get; set; } = string.Empty;
        public string EventTypeSupported { get; set; } = string.Empty;
        public decimal BaseRate { get; set; }
        public decimal MinCoverageAmount { get; set; }
        public decimal MaxCoverageAmount { get; set; }
        public string? SuggestionRemarks { get; set; }
        public decimal PremiumMonthly { get; set; }
        public decimal Premium6Months { get; set; }
        public decimal PremiumYearly { get; set; }
        public int SuggestedByAgentId { get; set; }
        public DateTime SuggestedAtUtc { get; set; }
    }
}