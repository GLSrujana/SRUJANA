using Insurance.Application.DTOs.Reports;

namespace Insurance.Application.Interfaces
{
    public interface IReportService
    {
        Task<AdminSummaryDto> GetAdminSummaryAsync();
        Task SyncPaymentsAndCommissionsAsync();
    }
}