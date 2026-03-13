namespace Insurance.Application.DTOs.PolicyProducts
{
    public class CreatePolicyProductDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string EventTypeSupported { get; set; } = string.Empty; // Wedding/Concert/Corporate etc.
        public decimal BaseRate { get; set; }                           // ex: 0.02 means 2%
        public decimal MinCoverageAmount { get; set; }
        public decimal MaxCoverageAmount { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}