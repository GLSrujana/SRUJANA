using Insurance.Application.DTOs.InsuranceRequests;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/admin/requests")]
    [Authorize(Roles = "Admin")]
    public class AdminRequestsController : ControllerBase
    {
        private readonly IInsuranceRequestService _service;
        private readonly IUserRepository _userRepo;

        public AdminRequestsController(IInsuranceRequestService service, IUserRepository userRepo)
        {
            _service = service;
            _userRepo = userRepo;
        }

        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents()
        {
            var agents = await _userRepo.GetUsersByRoleAsync("Agent");
            var result = agents.Select(a => new { a.Id, a.FullName, a.Email });
            return Ok(result);
        }

        [HttpGet("unassigned")]
        public async Task<IActionResult> GetUnassigned()
        {
            var result = await _service.GetUnassignedRequestsAsync();
            return Ok(result);
        }

        [HttpPost("assign-agent")]
        public async Task<IActionResult> AssignAgent([FromBody] AssignAgentDto dto)
        {
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var ok = await _service.AssignAgentAsync(adminId, dto);
            if (!ok) return NotFound("Request not found.");

            return Ok(new { message = "Agent assigned successfully." });
        }
    }
}