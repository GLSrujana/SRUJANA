namespace Insurance.Application.DTOs.PolicyCreationRequests
{
    public class CreatePolicyCreationRequestDto
    {
        public int InsuranceRequestId { get; set; }
        public string RequestedProductSummary { get; set; } = string.Empty;
        public string? RequiredCoverageDetails { get; set; }
    }
}