using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleTestController : ControllerBase
    {
        [HttpGet("admin-only")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnly()
        {
            return Ok("Welcome Admin! You can access admin-only endpoints.");
        }

        [HttpGet("agent-only")]
        [Authorize(Roles = "Agent")]
        public IActionResult AgentOnly()
        {
            return Ok("Welcome Agent! You can access agent-only endpoints.");
        }

        [HttpGet("customer-only")]
        [Authorize(Roles = "Customer")]
        public IActionResult CustomerOnly()
        {
            return Ok("Welcome Customer! You can access customer-only endpoints.");
        }

        [HttpGet("claims-officer-only")]
        [Authorize(Roles = "ClaimsOfficer")]
        public IActionResult ClaimsOfficerOnly()
        {
            return Ok("Welcome Claims Officer! You can access claims endpoints.");
        }

        [HttpGet("any-authenticated-user")]
        [Authorize]
        public IActionResult AnyAuthenticatedUser()
        {
            return Ok("You are authenticated successfully.");
        }
    }
}