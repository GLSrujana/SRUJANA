namespace Insurance.Application.DTOs.Payments
{
    public class CreatePaymentDto
    {
        public int ActivePolicyId { get; set; }
        public decimal Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionReference { get; set; }
    }
}