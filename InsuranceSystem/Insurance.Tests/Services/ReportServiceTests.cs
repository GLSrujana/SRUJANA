using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.Reports;

namespace Insurance.Tests.Services
{
    public class ReportServiceTests
    {
        [Fact]
        public async Task GetAdminSummaryAsync_CallsRepoAndReturns()
        {
            var repoMock = new Mock<IReportRepository>();
            var summary = new AdminSummaryDto { TotalActivePolicies = 10, PendingClaims = 2 };
            repoMock.Setup(r => r.GetAdminSummaryAsync()).ReturnsAsync(summary);

            var service = new ReportService(repoMock.Object);
            var result = await service.GetAdminSummaryAsync();

            Assert.Equal(10, result.TotalActivePolicies);
            Assert.Equal(2, result.PendingClaims);
        }
    }
}
