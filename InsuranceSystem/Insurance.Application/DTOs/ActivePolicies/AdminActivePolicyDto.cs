namespace Insurance.Application.DTOs.ActivePolicies
{
    public class AdminActivePolicyDto
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public string PolicyName { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string AgentName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalPremium { get; set; }
        public decimal CoverageAmount { get; set; }
        public DateTime StartDateUtc { get; set; }
        public DateTime EndDateUtc { get; set; }

        public int? InsuranceRequestId { get; set; }
        public string? EventType { get; set; }
        public DateTime? EventDate { get; set; }
        public string? Location { get; set; }
        public bool IsOutdoorVenue { get; set; }
        public bool HasFireworks { get; set; }
        public bool HasVipPresence { get; set; }
        public bool AlcoholServed { get; set; }
        public string? SpecialNotes { get; set; }

        public bool HasClaims { get; set; }
        public string? ClaimsOfficerName { get; set; }
        public string? ClaimStatus { get; set; }

        public string PaymentOption { get; set; } = "Yearly";
        public decimal PremiumAmountPerPayment { get; set; }
        public int TotalInstallments { get; set; }
        public int PaidInstallments { get; set; }
    }
}
