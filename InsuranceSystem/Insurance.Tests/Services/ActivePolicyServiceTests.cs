using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Tests.Services
{
    public class ActivePolicyServiceTests
    {
        [Fact]
        public async Task GetMyPoliciesAsync_ReturnsMappedDto()
        {
            // Arrange
            var repoMock = new Mock<IActivePolicyRepository>();
            var customerId = 123;
            var policies = new List<ActivePolicy>
            {
                new ActivePolicy 
                { 
                    Id = 1, 
                    PolicyNumber = "POL-1", 
                    CustomerId = customerId, 
                    AgentId = 5,
                    Status = PolicyStatus.Active,
                    TotalPremium = 500m,
                    PolicyApplication = new PolicyApplication { CoverageAmount = 10000m }
                }
            };

            repoMock.Setup(r => r.GetByCustomerAsync(customerId)).ReturnsAsync(policies);

            var service = new ActivePolicyService(repoMock.Object);

            // Act
            var result = await service.GetMyPoliciesAsync(customerId);

            // Assert
            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
            Assert.Equal("POL-1", result.First().PolicyNumber);
            Assert.Equal(customerId, result.First().CustomerId);
            Assert.Equal(5, result.First().AgentId);
            Assert.Equal("Active", result.First().Status);
            Assert.Equal(500m, result.First().TotalPremium);
            Assert.Equal(10000m, result.First().CoverageAmount);
        }
    }
}
