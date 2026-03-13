using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IPaymentRepository
    {
        Task AddAsync(Payment payment);
        Task<List<Payment>> GetPendingPaymentsAsync(int activePolicyId);
        Task SaveChangesAsync();
    }
}