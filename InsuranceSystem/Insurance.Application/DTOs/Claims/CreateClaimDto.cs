namespace Insurance.Application.DTOs.Claims
{
    public class CreateClaimDto
    {
        public int ActivePolicyId { get; set; }
        public string ClaimReason { get; set; } = string.Empty;
        public decimal ClaimAmountRequested { get; set; }
    }
}