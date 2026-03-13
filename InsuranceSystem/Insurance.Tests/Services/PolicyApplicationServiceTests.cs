using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.PolicyApplications;
using Insurance.Domain.Entities;

namespace Insurance.Tests.Services
{
    public class PolicyApplicationServiceTests
    {
        [Fact]
        public async Task SelectPolicyAsync_ValidRequest_CreatesApplication()
        {
            // Arrange
            var appRepo = new Mock<IPolicyApplicationRepository>();
            var reqRepo = new Mock<IInsuranceRequestRepository>();
            var prodRepo = new Mock<IPolicyProductRepository>();
            var activePolicyRepo = new Mock<IActivePolicyRepository>();
            var paymentRepo = new Mock<IPaymentRepository>();
            var commissionRepo = new Mock<IAgentCommissionRepository>();
            var notifService = new Mock<INotificationService>();

            var customerId = 10;

            reqRepo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(new InsuranceRequest
                {
                    Id = 1,
                    CustomerId = customerId,
                    AssignedAgentId = 7
                });

            appRepo.Setup(a => a.ExistsForRequestAsync(1)).ReturnsAsync(false);

            prodRepo.Setup(p => p.GetByIdAsync(2))
                .ReturnsAsync(new PolicyProduct { Id = 2, IsActive = true });

            var service = new PolicyApplicationService(
                appRepo.Object, reqRepo.Object, prodRepo.Object, activePolicyRepo.Object,
                paymentRepo.Object, commissionRepo.Object, notifService.Object
            );

            var dto = new SelectPolicyDto
            {
                InsuranceRequestId = 1,
                PolicyProductId = 2,
                CoverageAmount = 500000
            };

            // Act
            var result = await service.SelectPolicyAsync(customerId, dto);

            // Assert
            Assert.Equal(1, result.InsuranceRequestId);
            Assert.Equal(2, result.PolicyProductId);
            Assert.Equal(500000, result.CoverageAmount);

            appRepo.Verify(a => a.AddAsync(It.IsAny<PolicyApplication>()), Times.Once);
            appRepo.Verify(a => a.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task SelectPolicyAsync_WrongCustomer_ThrowsException()
        {
            // Arrange
            var appRepo = new Mock<IPolicyApplicationRepository>();
            var reqRepo = new Mock<IInsuranceRequestRepository>();
            var prodRepo = new Mock<IPolicyProductRepository>();
            var activePolicyRepo = new Mock<IActivePolicyRepository>();
            var paymentRepo = new Mock<IPaymentRepository>();
            var commissionRepo = new Mock<IAgentCommissionRepository>();
            var notifService = new Mock<INotificationService>();

            reqRepo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(new InsuranceRequest
                {
                    Id = 1,
                    CustomerId = 999,   // different customer
                    AssignedAgentId = 7
                });

            var service = new PolicyApplicationService(
                appRepo.Object, reqRepo.Object, prodRepo.Object, activePolicyRepo.Object,
                paymentRepo.Object, commissionRepo.Object, notifService.Object
            );

            var dto = new SelectPolicyDto
            {
                InsuranceRequestId = 1,
                PolicyProductId = 2,
                CoverageAmount = 100000
            };

            // Act + Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => service.SelectPolicyAsync(10, dto));
            Assert.Contains("not allowed", ex.Message, StringComparison.OrdinalIgnoreCase);

            appRepo.Verify(a => a.AddAsync(It.IsAny<PolicyApplication>()), Times.Never);
        }
    }
}