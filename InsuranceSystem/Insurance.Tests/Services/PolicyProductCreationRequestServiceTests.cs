using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.PolicyCreationRequests;
using Insurance.Application.DTOs.PolicyProducts;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Tests.Services
{
    public class PolicyProductCreationRequestServiceTests
    {
        [Fact]
        public async Task CreateAsync_WhenRequestNotFound_ThrowsException()
        {
            var repoMock = new Mock<IPolicyProductCreationRequestRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.GetSingleAdminUserIdAsync()).ReturnsAsync(1);
            reqRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((InsuranceRequest)null);

            var service = new PolicyProductCreationRequestService(repoMock.Object, reqRepoMock.Object, prodRepoMock.Object, notifMock.Object);

            var dto = new CreatePolicyCreationRequestDto { InsuranceRequestId = 99 };
            await Assert.ThrowsAsync<Exception>(() => service.CreateAsync(2, dto));
        }

        [Fact]
        public async Task CreateAsync_WhenAgentNotAssigned_ThrowsException()
        {
            var repoMock = new Mock<IPolicyProductCreationRequestRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.GetSingleAdminUserIdAsync()).ReturnsAsync(1);
            reqRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync(new InsuranceRequest { Id = 99, AssignedAgentId = 5 });

            var service = new PolicyProductCreationRequestService(repoMock.Object, reqRepoMock.Object, prodRepoMock.Object, notifMock.Object);

            var dto = new CreatePolicyCreationRequestDto { InsuranceRequestId = 99 };
            // Using agent 2 instead of assigned agent 5
            await Assert.ThrowsAsync<Exception>(() => service.CreateAsync(2, dto));
        }

        [Fact]
        public async Task AdminCreatePolicyAsync_WhenRequestNotFound_ThrowsException()
        {
            var repoMock = new Mock<IPolicyProductCreationRequestRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((PolicyProductCreationRequest)null);

            var service = new PolicyProductCreationRequestService(repoMock.Object, reqRepoMock.Object, prodRepoMock.Object, notifMock.Object);

            await Assert.ThrowsAsync<Exception>(() => service.AdminCreatePolicyAsync(1, 99, new CreatePolicyProductDto()));
        }
    }
}
