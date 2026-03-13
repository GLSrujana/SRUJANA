using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class PolicyApplication : BaseEntity
    {
        public int InsuranceRequestId { get; set; }
        public InsuranceRequest InsuranceRequest { get; set; } = null!;

        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public int AgentId { get; set; }
        public User Agent { get; set; } = null!;

        public int PolicyProductId { get; set; }
        public PolicyProduct PolicyProduct { get; set; } = null!;

        public ApplicationStatus Status { get; set; } = ApplicationStatus.SubmittedByCustomer;

        public decimal CoverageAmount { get; set; }
        public decimal CalculatedPremium { get; set; } // will fill in Phase 5 using risk engine

        public string PaymentOption { get; set; } = "Yearly"; // "Monthly", "SixMonths", "Yearly"
        public decimal PremiumAmountPerPayment { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}