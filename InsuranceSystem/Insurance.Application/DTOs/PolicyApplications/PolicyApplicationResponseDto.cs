using Insurance.Domain.Enums;

namespace Insurance.Application.DTOs.PolicyApplications
{
    public class PolicyApplicationResponseDto
    {
        public int Id { get; set; }
        public int InsuranceRequestId { get; set; }
        public int PolicyProductId { get; set; }
        public decimal CoverageAmount { get; set; }
        public decimal CalculatedPremium { get; set; }
        public ApplicationStatus Status { get; set; }
        public string PaymentOption { get; set; } = "Yearly";
        public decimal PremiumAmountPerPayment { get; set; }
    }
}