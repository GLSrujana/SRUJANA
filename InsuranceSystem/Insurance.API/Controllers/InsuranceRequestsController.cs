using Insurance.Application.DTOs.InsuranceRequests;
using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Insurance.Domain.Enums;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InsuranceRequestsController : ControllerBase
    {
        private readonly IInsuranceRequestService _service;

        public InsuranceRequestsController(IInsuranceRequestService service)
        {
            _service = service;
        }

        // CUSTOMER: Create a new insurance request
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInsuranceRequestDto dto)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateRequestAsync(customerId, dto);
            return Ok(result);
        }

        // CUSTOMER: View own requests
        [Authorize(Roles = "Customer")]
        [HttpGet("customer-requests")]
        public async Task<IActionResult> GetMyRequests()
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetCustomerRequestsAsync(customerId);
            return Ok(result);
        }

        // AGENT: Update request status (e.g., to InfoRequired or Rejected)
        [Authorize(Roles = "Agent")]
        [HttpPut("{requestId}/status")]
        public async Task<IActionResult> UpdateStatus(int requestId, [FromQuery] RequestStatus status, [FromQuery] string? remarks)
        {
            var agentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _service.UpdateRequestStatusAsync(agentId, requestId, status, remarks);
            if (!success) return BadRequest("Could not update status. Ensure you are assigned to this request.");
            return Ok(new { Message = "Status updated successfully." });
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("draft")]
        public async Task<IActionResult> CreateDraft([FromBody] CreateInsuranceRequestDto dto)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateDraftAsync(customerId, dto);
            return Ok(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpPut("draft/{requestId}")]
        public async Task<IActionResult> UpdateDraft(int requestId, [FromBody] CreateInsuranceRequestDto dto)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try {
                var result = await _service.UpdateDraftAsync(customerId, requestId, dto);
                return Ok(result);
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("{requestId}")]
        public async Task<IActionResult> GetById(int requestId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetRequestByIdAsync(userId, requestId);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [Authorize(Roles = "Customer")]
        [HttpPost("draft/{requestId}/submit")]
        public async Task<IActionResult> SubmitDraft(int requestId, [FromBody] CreateInsuranceRequestDto dto)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try {
                var result = await _service.SubmitDraftAsync(customerId, requestId, dto);
                return Ok(result);
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
    }
}