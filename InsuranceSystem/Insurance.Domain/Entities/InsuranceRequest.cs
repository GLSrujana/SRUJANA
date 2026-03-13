using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class InsuranceRequest : BaseEntity
    {
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public int? AssignedAgentId { get; set; }
        public User? AssignedAgent { get; set; }

        public decimal RequestedCoverageAmount { get; set; }
        public string? PreferredCoverageNotes { get; set; }

        public RequestStatus Status { get; set; } = RequestStatus.Submitted;

        public DateTime SubmittedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? AssignedAtUtc { get; set; }
        public string? AdminRemarks { get; set; }

        public RequestEventDetail? RequestEventDetail { get; set; }
    }
}