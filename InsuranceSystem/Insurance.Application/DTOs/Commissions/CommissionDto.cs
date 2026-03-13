namespace Insurance.Application.DTOs.Commissions
{
    public class CommissionDto
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public int ActivePolicyId { get; set; }
        public int PaymentId { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        public bool IsPaid { get; set; }
        public DateTime GeneratedAtUtc { get; set; }
        public DateTime? PaidAtUtc { get; set; }
    }
}