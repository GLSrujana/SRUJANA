using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/admin/reports")]
    [Authorize(Roles = "Admin")]
    public class AdminReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public AdminReportsController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
            => Ok(await _service.GetAdminSummaryAsync());

        /// <summary>
        /// One-time endpoint to clean stale Payment/Commission records 
        /// and recreate them from actual ActivePolicies.
        /// </summary>
        [HttpPost("sync-financial-data")]
        public async Task<IActionResult> SyncFinancialData()
        {
            await _service.SyncPaymentsAndCommissionsAsync();
            return Ok(new { message = "Payments and commissions synced to active policies." });
        }
    }
}