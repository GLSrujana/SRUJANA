using Insurance.Application.DTOs.PolicyProducts;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/admin/policy-creation-requests")]
    [Authorize(Roles = "Admin")]
    public class AdminPolicyCreationRequestsController : ControllerBase
    {
        private readonly IPolicyProductCreationRequestService _service;

        public AdminPolicyCreationRequestsController(IPolicyProductCreationRequestService service)
        {
            _service = service;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var result = await _service.GetPendingAsync();
            return Ok(result);
        }

        [HttpPost("{id:int}/create-policy")]
        public async Task<IActionResult> CreatePolicy(int id, [FromBody] CreatePolicyProductDto dto)
        {
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.AdminCreatePolicyAsync(adminId, id, dto);
            return Ok(result);
        }
    }
}