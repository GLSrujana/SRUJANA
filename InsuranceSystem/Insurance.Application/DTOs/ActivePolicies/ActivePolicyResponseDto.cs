namespace Insurance.Application.DTOs.ActivePolicies
{
    public class ActivePolicyResponseDto
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public string PolicyName { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int AgentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPremium { get; set; }
        public decimal CoverageAmount { get; set; }
        public DateTime StartDateUtc { get; set; }
        public DateTime EndDateUtc { get; set; }
        
        public bool IsPremiumPaid { get; set; }

        public string AgentName { get; set; } = string.Empty;
        
        public bool HasClaims { get; set; }
        public string? ClaimStatus { get; set; }
        public string? ClaimsOfficerName { get; set; }

        public string? EventType { get; set; }
        public DateTime? EventDate { get; set; }
        public string? Location { get; set; }
        public bool IsOutdoorVenue { get; set; }
        public bool HasFireworks { get; set; }
        public bool HasVipPresence { get; set; }
        public bool AlcoholServed { get; set; }
        public string? SpecialNotes { get; set; }

        public string PaymentOption { get; set; } = "Yearly";
        public int TotalInstallments { get; set; }
        public int PaidInstallments { get; set; }
        public DateTime? NextPaymentDueDate { get; set; }
        public decimal NextPaymentAmount { get; set; }
    }
}