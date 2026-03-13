using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class PolicySuggestion : BaseEntity
    {
        public int InsuranceRequestId { get; set; }
        public InsuranceRequest InsuranceRequest { get; set; } = null!;

        public int PolicyProductId { get; set; }
        public PolicyProduct PolicyProduct { get; set; } = null!;

        public int SuggestedByAgentId { get; set; }
        public User SuggestedByAgent { get; set; } = null!;

        public string? SuggestionRemarks { get; set; }
        public decimal PremiumMonthly { get; set; }
        public decimal Premium6Months { get; set; }
        public decimal PremiumYearly { get; set; }

        public bool IsSelectedByCustomer { get; set; } = false;

        public DateTime SuggestedAtUtc { get; set; } = DateTime.UtcNow;
    }
}