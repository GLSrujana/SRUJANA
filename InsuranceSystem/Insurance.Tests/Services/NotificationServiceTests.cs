using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.Notifications;

namespace Insurance.Tests.Services
{
    public class NotificationServiceTests
    {
        [Fact]
        public async Task CreateAsync_CallsRepo()
        {
            var repoMock = new Mock<INotificationRepository>();
            var service = new NotificationService(repoMock.Object);

            await service.CreateAsync(1, "Title", "Msg", "Type");

            repoMock.Verify(r => r.CreateAsync(1, "Title", "Msg", "Type"), Times.Once);
        }

        [Fact]
        public async Task GetMyAsync_CallsRepoAndReturns()
        {
            var repoMock = new Mock<INotificationRepository>();
            var dtos = new List<NotificationDto> { new NotificationDto { Id = 1 } };
            repoMock.Setup(r => r.GetMyAsync(1)).ReturnsAsync(dtos);

            var service = new NotificationService(repoMock.Object);
            var result = await service.GetMyAsync(1);

            Assert.Single(result);
            Assert.Equal(1, result[0].Id);
        }

        [Fact]
        public async Task MarkReadAsync_CallsRepo()
        {
            var repoMock = new Mock<INotificationRepository>();
            var service = new NotificationService(repoMock.Object);

            await service.MarkReadAsync(1, 2);

            repoMock.Verify(r => r.MarkReadAsync(1, 2), Times.Once);
        }
    }
}
