using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class ActivePolicy : BaseEntity
    {
        public int PolicyApplicationId { get; set; }
        public PolicyApplication PolicyApplication { get; set; } = null!;

        public string PolicyNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public int AgentId { get; set; }
        public User Agent { get; set; } = null!;

        public PolicyStatus Status { get; set; } = PolicyStatus.Active;
        public DateTime StartDateUtc { get; set; } = DateTime.UtcNow;
        public DateTime EndDateUtc { get; set; } // set +1 year

        public decimal TotalPremium { get; set; } // from PolicyApplication.CalculatedPremium (for now can use 0 or simple calc)

        public string PaymentOption { get; set; } = "Yearly"; // "Monthly", "SixMonths", "Yearly"
        public decimal PremiumAmountPerPayment { get; set; }

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}