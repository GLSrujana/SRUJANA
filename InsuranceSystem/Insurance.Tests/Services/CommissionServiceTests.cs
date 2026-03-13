using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;

namespace Insurance.Tests.Services
{
    public class CommissionServiceTests
    {
        [Fact]
        public async Task MarkPaidAsync_WhenCommissionNotFound_ThrowsException()
        {
            var repoMock = new Mock<IAgentCommissionRepository>();
            repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((AgentCommission)null);
            var service = new CommissionService(repoMock.Object);

            await Assert.ThrowsAsync<Exception>(() => service.MarkPaidAsync(1));
        }

        [Fact]
        public async Task MarkPaidAsync_WhenAlreadyPaid_DoesNotUpdate()
        {
            var repoMock = new Mock<IAgentCommissionRepository>();
            var comm = new AgentCommission { Id = 1, IsPaid = true };
            repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(comm);
            var service = new CommissionService(repoMock.Object);

            await service.MarkPaidAsync(1);

            repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task MarkPaidAsync_WhenNotPaid_UpdatesAndSaves()
        {
            var repoMock = new Mock<IAgentCommissionRepository>();
            var comm = new AgentCommission { Id = 1, IsPaid = false };
            repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(comm);
            var service = new CommissionService(repoMock.Object);

            await service.MarkPaidAsync(1);

            Assert.True(comm.IsPaid);
            Assert.NotNull(comm.PaidAtUtc);
            repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
