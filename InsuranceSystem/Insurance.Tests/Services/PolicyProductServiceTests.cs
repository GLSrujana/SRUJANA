using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.PolicyProducts;
using Insurance.Domain.Entities;

namespace Insurance.Tests.Services
{
    public class PolicyProductServiceTests
    {
        [Fact]
        public async Task CreateAsync_ReturnsMappedDto()
        {
            var repoMock = new Mock<IPolicyProductRepository>();
            var service = new PolicyProductService(repoMock.Object);

            var dto = new CreatePolicyProductDto
            {
                ProductName = "Wedding Plan",
                EventTypeSupported = "Wedding",
                BaseRate = 100m,
                MinCoverageAmount = 5000m,
                MaxCoverageAmount = 50000m,
                Description = "Basic wedding",
                IsActive = true
            };

            var adminId = 1;

            var result = await service.CreateAsync(adminId, dto);

            // Using any because AddAsync might update the object passed or just save it
            repoMock.Verify(r => r.AddAsync(It.IsAny<PolicyProduct>()), Times.Once);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);

            Assert.Equal("Wedding Plan", result.ProductName);
            Assert.Equal("Wedding", result.EventTypeSupported);
            Assert.Equal(adminId, result.CreatedByAdminId);
            Assert.True(result.IsActive);
        }

        [Fact]
        public async Task UpdateAsync_WhenProductNotFound_ThrowsException()
        {
            var repoMock = new Mock<IPolicyProductRepository>();
            repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((PolicyProduct)null);
            var service = new PolicyProductService(repoMock.Object);

            await Assert.ThrowsAsync<Exception>(() => service.UpdateAsync(1, new UpdatePolicyProductDto()));
        }

        [Fact]
        public async Task SetActiveAsync_UpdatesAndReturns()
        {
            var product = new PolicyProduct { Id = 1, IsActive = false, ProductName = "A", EventTypeSupported = "B" };
            var repoMock = new Mock<IPolicyProductRepository>();
            repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
            var service = new PolicyProductService(repoMock.Object);

            var result = await service.SetActiveAsync(1, true);

            Assert.True(product.IsActive);
            Assert.True(result.IsActive);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
