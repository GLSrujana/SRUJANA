using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class Claim : BaseEntity
    {
        public int ActivePolicyId { get; set; }
        public ActivePolicy ActivePolicy { get; set; } = null!;

        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public ClaimStatus Status { get; set; } = ClaimStatus.Submitted;

        public string ClaimReason { get; set; } = string.Empty;
        public decimal ClaimAmountRequested { get; set; }

        public int? ReviewedByClaimsOfficerId { get; set; }
        public User? ReviewedByClaimsOfficer { get; set; }

        public decimal? ApprovedSettlementAmount { get; set; }
        public string? OfficerRemarks { get; set; }

        public DateTime SubmittedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAtUtc { get; set; }
    }
}