using Insurance.Domain.Common;
using Insurance.Domain.Enums;

namespace Insurance.Domain.Entities
{
    public class Payment : BaseEntity
    {
        public int ActivePolicyId { get; set; }
        public ActivePolicy ActivePolicy { get; set; } = null!;
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Paid;
        public DateTime? DueDateUtc { get; set; }
        public DateTime? PaidAtUtc { get; set; }

        public string? TransactionReference { get; set; }
        public string? PaymentMethod { get; set; }
        public int InstallmentNumber { get; set; } = 1;
    }
}