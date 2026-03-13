using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class PolicyProductCreationRequest : BaseEntity
    {
        public int InsuranceRequestId { get; set; }
        public InsuranceRequest InsuranceRequest { get; set; } = null!;

        public int RequestedByAgentId { get; set; }
        public User RequestedByAgent { get; set; } = null!;

        public int RequestedToAdminId { get; set; }
        public User RequestedToAdmin { get; set; } = null!;

        public string RequestedProductSummary { get; set; } = string.Empty;
        public string? RequiredCoverageDetails { get; set; }


        public PolicyCreationRequestStatus Status { get; set; } = PolicyCreationRequestStatus.Pending;

        public int? CreatedPolicyProductId { get; set; }
        public PolicyProduct? CreatedPolicyProduct { get; set; }

        public DateTime RequestedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAtUtc { get; set; }
        public string? AdminRemarks { get; set; }
    }
}