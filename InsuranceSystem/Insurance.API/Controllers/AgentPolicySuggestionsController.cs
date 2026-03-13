using Insurance.Application.DTOs.PolicySuggestions;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/agent/policy-suggestions")]
    [Authorize(Roles = "Agent")]
    public class AgentPolicySuggestionsController : ControllerBase
    {
        private readonly IPolicySuggestionService _service;

        public AgentPolicySuggestionsController(IPolicySuggestionService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePolicySuggestionDto dto)
        {
            var agentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateSuggestionsAsync(agentId, dto);
            return Ok(result);
        }
    }
}