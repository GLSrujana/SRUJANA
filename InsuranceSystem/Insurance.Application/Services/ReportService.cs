using Insurance.Application.DTOs.Reports;
using Insurance.Application.Interfaces;

namespace Insurance.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repo;

        public ReportService(IReportRepository repo)
        {
            _repo = repo;
        }

        public Task<AdminSummaryDto> GetAdminSummaryAsync()
        {
            return _repo.GetAdminSummaryAsync();
        }

        public Task SyncPaymentsAndCommissionsAsync()
        {
            return _repo.SyncPaymentsAndCommissionsAsync();
        }
    }
}