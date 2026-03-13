using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/active-policies")]
    public class ActivePoliciesController : ControllerBase
    {
        private readonly IActivePolicyService _service;

        public ActivePoliciesController(IActivePolicyService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("customer-active-policies")]
        public async Task<IActionResult> MyPolicies()
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetMyPoliciesAsync(customerId);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> AllPolicies()
        {
            var result = await _service.GetAllForAdminAsync();
            return Ok(result);
        }
    }
}