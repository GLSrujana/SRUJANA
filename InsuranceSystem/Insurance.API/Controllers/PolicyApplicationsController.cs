using Insurance.Application.DTOs.PolicyApplications;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/policy-applications")]
    public class PolicyApplicationsController : ControllerBase
    {
        private readonly IPolicyApplicationService _service;

        public PolicyApplicationsController(IPolicyApplicationService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("select")]
        public async Task<IActionResult> SelectPolicy([FromBody] SelectPolicyDto dto)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.SelectPolicyAsync(customerId, dto);
            return Ok(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("customer-applications")]
        public async Task<IActionResult> MyApplications()
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetMyApplicationsAsync(customerId);
            return Ok(result);
        }
    }
}