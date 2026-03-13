using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class AgentAssignment : BaseEntity
    {
        public int InsuranceRequestId { get; set; }
        public InsuranceRequest InsuranceRequest { get; set; } = null!;

        public int AgentId { get; set; }
        public User Agent { get; set; } = null!;

        public int AssignedByAdminId { get; set; }
        public User AssignedByAdmin { get; set; } = null!;

        public DateTime AssignedAtUtc { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}