using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.Claims;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Tests.Services
{
    public class ClaimServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidCustomer_CreatesClaimAndNotifiesOfficer()
        {
            // Arrange
            var claimRepo = new Mock<IClaimRepository>();
            var policyRepo = new Mock<IActivePolicyRepository>();
            var notif = new Mock<INotificationService>();

            policyRepo.Setup(p => p.GetByIdAsync(1))
                .ReturnsAsync(new ActivePolicy { Id = 1, CustomerId = 10 });

            claimRepo.Setup(r => r.GetClaimsOfficerUserIdsAsync())
                .ReturnsAsync(new System.Collections.Generic.List<int> { 99 });

            var service = new ClaimService(claimRepo.Object, policyRepo.Object, notif.Object);

            var dto = new CreateClaimDto
            {
                ActivePolicyId = 1,
                ClaimReason = "Event cancelled",
                ClaimAmountRequested = 5000
            };

            // Act
            var result = await service.CreateAsync(10, dto);

            // Assert
            Assert.Equal(1, result.ActivePolicyId);
            Assert.Equal(10, result.CustomerId);
            Assert.Equal(ClaimStatus.Submitted, result.Status);

            claimRepo.Verify(r => r.AddAsync(It.IsAny<Claim>()), Times.Once);
            claimRepo.Verify(r => r.SaveChangesAsync(), Times.Once);

            notif.Verify(n => n.CreateAsync(99, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
            notif.Verify(n => n.CreateAsync(10, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task ReviewAsync_UpdatesStatus_AndNotifiesCustomer()
        {
            // Arrange
            var claimRepo = new Mock<IClaimRepository>();
            var policyRepo = new Mock<IActivePolicyRepository>();
            var notif = new Mock<INotificationService>();

            claimRepo.Setup(r => r.GetByIdAsync(5))
                .ReturnsAsync(new Claim
                {
                    Id = 5,
                    CustomerId = 10,
                    ActivePolicyId = 1,
                    Status = ClaimStatus.Submitted,
                    ClaimReason = "Test",
                    ClaimAmountRequested = 1000
                });

            var service = new ClaimService(claimRepo.Object, policyRepo.Object, notif.Object);

            var dto = new ReviewClaimDto
            {
                Status = ClaimStatus.Approved,
                ApprovedSettlementAmount = 800,
                OfficerRemarks = "Ok"
            };

            // Act
            var result = await service.ReviewAsync(99, 5, dto);

            // Assert
            Assert.Equal(ClaimStatus.Approved, result.Status);
            Assert.Equal(800, result.ApprovedSettlementAmount);

            claimRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
            notif.Verify(n => n.CreateAsync(10, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }
    }
}