using Insurance.Application.DTOs.Payments;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IActivePolicyRepository _policyRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IAgentCommissionRepository _commissionRepo;
        private readonly INotificationService _notif;

        public PaymentService(
            IActivePolicyRepository policyRepo,
            IPaymentRepository paymentRepo,
            IAgentCommissionRepository commissionRepo,
            INotificationService notif)
        {
            _policyRepo = policyRepo;
            _paymentRepo = paymentRepo;
            _commissionRepo = commissionRepo;
            _notif = notif;
        }

        public async Task<PaymentResponseDto> PayAsync(int customerId, CreatePaymentDto dto)
        {
            var policy = await _policyRepo.GetByIdAsync(dto.ActivePolicyId)
                         ?? throw new Exception("Active policy not found.");

            if (policy.CustomerId != customerId)
                throw new Exception("You cannot pay for someone else's policy.");

            // Fetch oldest pending payment
            var pendingPayments = await _paymentRepo.GetPendingPaymentsAsync(policy.Id);
            var payment = pendingPayments.FirstOrDefault() 
                          ?? throw new Exception("No pending payments found for this policy.");

            // Update payment
            payment.Status = PaymentStatus.Paid;
            payment.PaidAtUtc = DateTime.UtcNow;
            payment.PaymentMethod = dto.PaymentMethod;
            payment.TransactionReference = dto.TransactionReference;

            await _paymentRepo.SaveChangesAsync();

            // Generate commission (example: 10%)
            const decimal commissionRate = 0.10m;
            var commission = new AgentCommission
            {
                AgentId = policy.AgentId,
                ActivePolicyId = policy.Id,
                PaymentId = payment.Id,
                CommissionRate = commissionRate,
                CommissionAmount = Math.Round(payment.Amount * commissionRate, 2),
                IsPaid = false,
                GeneratedAtUtc = DateTime.UtcNow
            };

            await _commissionRepo.AddAsync(commission);
            await _commissionRepo.SaveChangesAsync();

            // ✅ Notifications
            await _notif.CreateAsync(
                userId: policy.CustomerId,
                title: "Payment successful",
                message: $"Payment received for Policy ID: {policy.Id}. Amount: {payment.Amount}.",
                type: "PaymentReminder"
            );

            // Check if there is another pending payment to notify them about
            var nextPayment = pendingPayments.Skip(1).FirstOrDefault();
            if (nextPayment != null)
            {
                await _notif.CreateAsync(
                    userId: policy.CustomerId,
                    title: "Next Payment Due Reminder",
                    message: $"Your next premium payment of {nextPayment.Amount:C} is due on {nextPayment.DueDateUtc:MMM dd, yyyy}.",
                    type: "PaymentReminder"
                );
            }

            await _notif.CreateAsync(
                userId: policy.AgentId,
                title: "Commission generated",
                message: $"Commission generated for Policy ID: {policy.Id}. Payment ID: {payment.Id}.",
                type: "PaymentReminder"
            );

            return new PaymentResponseDto
            {
                PaymentId = payment.Id,
                ActivePolicyId = payment.ActivePolicyId,
                Amount = payment.Amount,
                Status = payment.Status,
                PaidAtUtc = payment.PaidAtUtc,
                DueDateUtc = payment.DueDateUtc,
                InstallmentNumber = payment.InstallmentNumber,
                PaymentMethod = payment.PaymentMethod,
                TransactionReference = payment.TransactionReference
            };
        }
    }
}