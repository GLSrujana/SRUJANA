using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/agent/requests")]
    public class AgentRequestsController : ControllerBase
    {
        private readonly IInsuranceRequestService _service;

        public AgentRequestsController(IInsuranceRequestService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Agent")]
        [HttpGet("assigned")]
        public async Task<IActionResult> Assigned()
        {
            var agentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetAgentAssignedRequestsAsync(agentId);
            return Ok(result);
        }
    }
}