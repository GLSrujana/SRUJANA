using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/admin/policy-applications")]
    [Authorize(Roles = "Admin")]
    public class AdminPolicyApplicationsController : ControllerBase
    {
        private readonly IPolicyApplicationService _service;

        public AdminPolicyApplicationsController(IPolicyApplicationService service)
        {
            _service = service;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> Pending()
            => Ok(await _service.GetPendingAsync());

        [HttpPut("{id:int}/approve")]
        public async Task<IActionResult> Approve(int id, [FromBody] Insurance.Application.DTOs.PolicyApplications.ApprovePolicyDto? dto)
            => Ok(await _service.ApproveAsync(id, dto));

        [HttpPut("{id:int}/reject")]
        public async Task<IActionResult> Reject(int id)
            => Ok(await _service.RejectAsync(id));
    }
}