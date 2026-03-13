using Insurance.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Insurance.API.Controllers
{
    [ApiController]
    [Route("api/customer/requests")]
    [Authorize(Roles = "Customer")]
    public class CustomerSuggestionsController : ControllerBase
    {
        private readonly IPolicySuggestionService _service;
        private readonly IInsuranceRequestRepository _requestRepo;

        public CustomerSuggestionsController(IPolicySuggestionService service, IInsuranceRequestRepository requestRepo)
        {
            _service = service;
            _requestRepo = requestRepo;
        }

        [HttpGet("{requestId:int}/suggestions")]
        public async Task<IActionResult> GetSuggestions(int requestId)
        {
            var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var request = await _requestRepo.GetByIdAsync(requestId);
            if (request == null || request.CustomerId != customerId)
                return Forbid();

            var result = await _service.GetSuggestionsForRequestAsync(requestId);
            return Ok(result);
        }
    }
}