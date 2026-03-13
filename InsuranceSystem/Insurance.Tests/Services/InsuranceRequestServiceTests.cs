using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.InsuranceRequests;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Tests.Services
{
    public class InsuranceRequestServiceTests
    {
        [Fact]
        public async Task CreateRequestAsync_WhenNoAdmin_SavesButDoesNotNotifyAdmin()
        {
            var repoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.GetSingleAdminUserIdAsync()).ReturnsAsync((int?)null);

            var service = new InsuranceRequestService(repoMock.Object, notifMock.Object);
            var dto = new CreateInsuranceRequestDto { EventType = "Test" };
            
            var result = await service.CreateRequestAsync(10, dto);

            repoMock.Verify(r => r.AddRequestAsync(It.IsAny<InsuranceRequest>()), Times.Once);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
            notifMock.Verify(n => n.CreateAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task CreateRequestAsync_WhenAdminExists_NotifiesAdmin()
        {
            var repoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.GetSingleAdminUserIdAsync()).ReturnsAsync(1);

            var service = new InsuranceRequestService(repoMock.Object, notifMock.Object);
            var dto = new CreateInsuranceRequestDto { EventType = "Test" };
            
            var result = await service.CreateRequestAsync(10, dto);

            repoMock.Verify(r => r.AddRequestAsync(It.IsAny<InsuranceRequest>()), Times.Once);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
            notifMock.Verify(n => n.CreateAsync(1, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);

            Assert.Equal(RequestStatus.Submitted, result.Status);
        }

        [Fact]
        public async Task AssignAgentAsync_WhenOk_NotifiesAgentAndCustomer()
        {
            var repoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            repoMock.Setup(r => r.AssignAgentAsync(5, 100, 1, "remarks")).ReturnsAsync(true);
            repoMock.Setup(r => r.GetCustomerIdByRequestIdAsync(5)).ReturnsAsync(99);

            var service = new InsuranceRequestService(repoMock.Object, notifMock.Object);
            var dto = new AssignAgentDto { RequestID = 5, AgentID = 100, AdminRemarks = "remarks" };
            
            var result = await service.AssignAgentAsync(1, dto);

            Assert.True(result);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
            notifMock.Verify(n => n.CreateAsync(100, It.IsAny<string>(), It.IsAny<string>(), "PolicyUpdate"), Times.Once);
            notifMock.Verify(n => n.CreateAsync(99, It.IsAny<string>(), It.IsAny<string>(), "PolicyUpdate"), Times.Once);
        }
    }
}
