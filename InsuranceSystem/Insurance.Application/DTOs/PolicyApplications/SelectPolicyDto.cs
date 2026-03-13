namespace Insurance.Application.DTOs.PolicyApplications
{
    public class SelectPolicyDto
    {
        public int InsuranceRequestId { get; set; }
        public int PolicyProductId { get; set; }
        public decimal CoverageAmount { get; set; }
        public string PaymentOption { get; set; } = "Yearly";
    }
}