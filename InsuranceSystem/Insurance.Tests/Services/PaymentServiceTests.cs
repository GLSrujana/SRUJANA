using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.Payments;
using Insurance.Domain.Entities;

namespace Insurance.Tests.Services
{
    public class PaymentServiceTests
    {
        [Fact]
        public async Task PayAsync_ValidCustomer_CreatesPaymentAndCommissionAndNotifications()
        {
            // Arrange
            var policyRepo = new Mock<IActivePolicyRepository>();
            var paymentRepo = new Mock<IPaymentRepository>();
            var commissionRepo = new Mock<IAgentCommissionRepository>();
            var notif = new Mock<INotificationService>();

            var customerId = 10;
            policyRepo.Setup(p => p.GetByIdAsync(1))
                .ReturnsAsync(new ActivePolicy
                {
                    Id = 1,
                    CustomerId = customerId,
                    AgentId = 7
                });

            // IMPORTANT: simulate PaymentId being generated after save
            paymentRepo.Setup(p => p.AddAsync(It.IsAny<Payment>()))
                .Callback<Payment>(pay => pay.Id = 123)
                .Returns(Task.CompletedTask);

            var service = new PaymentService(
                policyRepo.Object, paymentRepo.Object, commissionRepo.Object, notif.Object
            );

            var dto = new CreatePaymentDto
            {
                ActivePolicyId = 1,
                Amount = 20000,
                PaymentMethod = "UPI",
                TransactionReference = "TXN1"
            };

            // Act
            var result = await service.PayAsync(customerId, dto);

            // Assert
            Assert.Equal(1, result.ActivePolicyId);
            Assert.Equal(20000, result.Amount);
            Assert.Equal(123, result.PaymentId);

            paymentRepo.Verify(p => p.AddAsync(It.IsAny<Payment>()), Times.Once);
            paymentRepo.Verify(p => p.SaveChangesAsync(), Times.Once);

            commissionRepo.Verify(c => c.AddAsync(It.IsAny<AgentCommission>()), Times.Once);
            commissionRepo.Verify(c => c.SaveChangesAsync(), Times.Once);

            notif.Verify(n => n.CreateAsync(customerId, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
            notif.Verify(n => n.CreateAsync(7, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }
    }
}