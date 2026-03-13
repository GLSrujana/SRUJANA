using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        /// <summary>
        /// DEBUG ENDPOINT - Remove in production
        /// Shows all claims in the current JWT token for troubleshooting
        /// </summary>
        [Authorize]
        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            if (User?.Identity?.IsAuthenticated != true)
            {
                return Unauthorized(new { error = "User is not authenticated" });
            }

            var claims = User.Claims.Select(c => new
            {
                type = c.Type,
                value = c.Value
            }).ToList();

            return Ok(new
            {
                isAuthenticated = User.Identity.IsAuthenticated,
                authenticationType = User.Identity.AuthenticationType,
                name = User.Identity.Name,
                claimsCount = claims.Count,
                claims = claims,
                roleFromClaim = User.FindFirstValue(ClaimTypes.Role),
                userIdFromClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            });
        }

        /// <summary>
        /// DEBUG ENDPOINT - Remove in production
        /// Test endpoint that requires Customer role
        /// </summary>
        [Authorize(Roles = "Customer")]
        [HttpGet("test-customer")]
        public IActionResult TestCustomerAuth()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new
            {
                message = "? Customer authorization successful!",
                userId = userId,
                role = role
            });
        }

        /// <summary>
        /// DEBUG ENDPOINT - Remove in production
        /// Test endpoint that requires Admin role
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("test-admin")]
        public IActionResult TestAdminAuth()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new
            {
                message = "? Admin authorization successful!",
                userId = userId,
                role = role
            });
        }

        /// <summary>
        /// DEBUG ENDPOINT - Remove in production
        /// Test endpoint without authorization requirement
        /// </summary>
        [HttpGet("test-public")]
        public IActionResult TestPublic()
        {
            var isAuth = User?.Identity?.IsAuthenticated ?? false;

            return Ok(new
            {
                message = "? Public endpoint accessible",
                isAuthenticated = isAuth
            });
        }
    }
}
