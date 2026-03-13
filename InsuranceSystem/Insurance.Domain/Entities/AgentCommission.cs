using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class AgentCommission : BaseEntity
    {
        public int AgentId { get; set; }
        public User Agent { get; set; } = null!;

        public int ActivePolicyId { get; set; }
        public ActivePolicy ActivePolicy { get; set; } = null!;

        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;

        public decimal CommissionRate { get; set; } // ex: 0.10
        public decimal CommissionAmount { get; set; }
        public bool IsPaid { get; set; } = false;

        public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAtUtc { get; set; }
    }
}