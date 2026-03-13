using Insurance.Application.DTOs.PolicyCreationRequests;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/agent/policy-creation-requests")]
    [Authorize(Roles = "Agent")]
    public class AgentPolicyCreationRequestsController : ControllerBase
    {
        private readonly IPolicyProductCreationRequestService _service;

        public AgentPolicyCreationRequestsController(IPolicyProductCreationRequestService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePolicyCreationRequestDto dto)
        {
            var agentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateAsync(agentId, dto);
            return Ok(result);
        }
    }
}