using Insurance.Application.DTOs.Reports;

namespace Insurance.Application.Interfaces
{
    public interface IReportRepository
    {
        Task<AdminSummaryDto> GetAdminSummaryAsync();
        Task SyncPaymentsAndCommissionsAsync();
    }
}