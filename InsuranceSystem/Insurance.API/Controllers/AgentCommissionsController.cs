using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/agent/commissions")]
    [Authorize(Roles = "Agent")]
    public class AgentCommissionsController : ControllerBase
    {
        private readonly ICommissionService _service;

        public AgentCommissionsController(ICommissionService service)
        {
            _service = service;
        }

        [HttpGet("agent-commissions")]
        public async Task<IActionResult> My()
        {
            var agentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _service.GetMyAsync(agentId));
        }
    }
}