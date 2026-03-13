using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/admin/commissions")]
    [Authorize(Roles = "Admin")]
    public class AdminCommissionsController : ControllerBase
    {
        private readonly ICommissionService _service;

        public AdminCommissionsController(ICommissionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> All()
            => Ok(await _service.GetAllAsync());

        [HttpPut("{id:int}/mark-paid")]
        public async Task<IActionResult> MarkPaid(int id)
        {
            await _service.MarkPaidAsync(id);
            return Ok(new { message = "Commission marked as paid" });
        }
    }
}