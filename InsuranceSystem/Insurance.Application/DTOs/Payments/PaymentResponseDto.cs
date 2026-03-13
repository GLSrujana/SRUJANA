using Insurance.Domain.Enums;

namespace Insurance.Application.DTOs.Payments
{
    public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public int ActivePolicyId { get; set; }
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime? DueDateUtc { get; set; }
        public DateTime? PaidAtUtc { get; set; }
        public int InstallmentNumber { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionReference { get; set; }
    }
}