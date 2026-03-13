using Insurance.Domain.Enums;

namespace Insurance.Application.DTOs.Claims
{
    public class ReviewClaimDto
    {
        public ClaimStatus Status { get; set; }  // Approved / Rejected / Settled
        public decimal? ApprovedSettlementAmount { get; set; }
        public string? OfficerRemarks { get; set; }
    }
}