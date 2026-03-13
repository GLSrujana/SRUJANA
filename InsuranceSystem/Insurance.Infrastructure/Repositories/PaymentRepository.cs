using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly InsuranceDbContext _db;
        public PaymentRepository(InsuranceDbContext db) => _db = db;
        public async Task AddAsync(Payment payment) => await _db.Payments.AddAsync(payment);
        
        public Task<List<Payment>> GetPendingPaymentsAsync(int activePolicyId)
            => _db.Payments
                  .Where(p => p.ActivePolicyId == activePolicyId && p.Status == Insurance.Domain.Enums.PaymentStatus.Pending)
                  .OrderBy(p => p.InstallmentNumber)
                  .ToListAsync();
                  
        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}