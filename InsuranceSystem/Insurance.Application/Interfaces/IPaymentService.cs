using Insurance.Application.DTOs.Payments;

namespace Insurance.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> PayAsync(int customerId, CreatePaymentDto dto);
    }
}