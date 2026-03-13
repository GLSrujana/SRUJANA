using Insurance.Application.DTOs.Claims;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/claims-officer/claims")]
    [Authorize(Roles = "ClaimsOfficer")]
    public class ClaimsOfficerController : ControllerBase
    {
        private readonly IClaimService _service;

        public ClaimsOfficerController(IClaimService service)
        {
            _service = service;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> Pending()
            => Ok(await _service.GetPendingAsync());

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpPut("{id:int}/review")]
        public async Task<IActionResult> Review(int id, [FromBody] ReviewClaimDto dto)
        {
            var officerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _service.ReviewAsync(officerId, id, dto));
        }
    }
}