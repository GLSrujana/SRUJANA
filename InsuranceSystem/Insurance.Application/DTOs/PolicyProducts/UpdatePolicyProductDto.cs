namespace Insurance.Application.DTOs.PolicyProducts
{
    public class UpdatePolicyProductDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string EventTypeSupported { get; set; } = string.Empty;
        public decimal BaseRate { get; set; }
        public decimal MinCoverageAmount { get; set; }
        public decimal MaxCoverageAmount { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}