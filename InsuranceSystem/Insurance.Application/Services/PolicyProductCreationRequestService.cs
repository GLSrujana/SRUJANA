using Insurance.Application.DTOs.PolicyCreationRequests;
using Insurance.Application.DTOs.PolicyProducts;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    public class PolicyProductCreationRequestService : IPolicyProductCreationRequestService
    {
        private readonly IPolicyProductCreationRequestRepository _repo;
        private readonly IInsuranceRequestRepository _requestRepo;
        private readonly IPolicyProductRepository _policyProductRepo;
        private readonly INotificationService _notif;

        public PolicyProductCreationRequestService(
            IPolicyProductCreationRequestRepository repo,
            IInsuranceRequestRepository requestRepo,
            IPolicyProductRepository policyProductRepo,
            INotificationService notif)
        {
            _repo = repo;
            _requestRepo = requestRepo;
            _policyProductRepo = policyProductRepo;
            _notif = notif;
        }

        public async Task<object> CreateAsync(int agentId, CreatePolicyCreationRequestDto dto)
        {
            var adminId = await _repo.GetSingleAdminUserIdAsync();
            if (adminId == null) throw new Exception("Admin user not found.");

            var req = await _requestRepo.GetByIdAsync(dto.InsuranceRequestId)
                      ?? throw new Exception("Insurance request not found.");

            if (req.AssignedAgentId != agentId)
                throw new Exception("You are not assigned to this request.");

            var creationReq = new PolicyProductCreationRequest
            {
                InsuranceRequestId = dto.InsuranceRequestId,
                RequestedByAgentId = agentId,
                RequestedToAdminId = adminId.Value,
                RequestedProductSummary = dto.RequestedProductSummary.Trim(),
                RequiredCoverageDetails = dto.RequiredCoverageDetails,
                Status = PolicyCreationRequestStatus.Pending
            };

            await _repo.AddAsync(creationReq);
            await _repo.SaveChangesAsync();

            // ✅ Notify Admin
            await _notif.CreateAsync(
                userId: adminId.Value,
                title: "New policy creation request",
                message: $"Agent requested a new policy for InsuranceRequest ID: {dto.InsuranceRequestId}.",
                type: "PolicyUpdate"
            );

            return new { creationReq.Id, Status = creationReq.Status.ToString() };
        }

        public async Task<object> GetPendingAsync()
        {
            var list = await _repo.GetPendingAsync();
            return list.Select(x => new
            {
                x.Id,
                x.InsuranceRequestId,
                x.RequestedByAgentId,
                x.RequestedProductSummary,
                x.RequiredCoverageDetails,
                Status = x.Status.ToString(),
                x.RequestedAtUtc
            }).ToList();
        }

        public async Task<object> AdminCreatePolicyAsync(int adminId, int creationRequestId, CreatePolicyProductDto dto)
        {
            var creationReq = await _repo.GetByIdAsync(creationRequestId)
                             ?? throw new Exception("Creation request not found.");

            if (creationReq.Status != PolicyCreationRequestStatus.Pending)
                throw new Exception("This request is already resolved.");

            // Create the policy product
            var product = new PolicyProduct
            {
                ProductName = dto.ProductName.Trim(),
                EventTypeSupported = dto.EventTypeSupported.Trim(),
                BaseRate = dto.BaseRate,
                MinCoverageAmount = dto.MinCoverageAmount,
                MaxCoverageAmount = dto.MaxCoverageAmount,
                Description = dto.Description,
                IsActive = dto.IsActive,
                CreatedByAdminID = adminId
            };

            await _policyProductRepo.AddAsync(product);
            await _policyProductRepo.SaveChangesAsync();

            // Link back to creation request
            creationReq.CreatedPolicyProductId = product.Id;
            creationReq.Status = PolicyCreationRequestStatus.Created;
            creationReq.ResolvedAtUtc = DateTime.UtcNow;

            await _repo.SaveChangesAsync();

            // ✅ Notify Agent
            await _notif.CreateAsync(
                userId: creationReq.RequestedByAgentId,
                title: "Policy created by admin",
                message: $"Admin created PolicyProduct ID: {product.Id} for Request ID: {creationReq.InsuranceRequestId}. You can now suggest it to the customer.",
                type: "PolicyUpdate"
            );

            // Optional: notify customer too
            var customerId = await _requestRepo.GetCustomerIdByRequestIdAsync(creationReq.InsuranceRequestId);
            if (customerId != null)
            {
                await _notif.CreateAsync(
                    userId: customerId.Value,
                    title: "New policy option available",
                    message: $"A new policy option has been created for your request (Request ID: {creationReq.InsuranceRequestId}).",
                    type: "PolicyUpdate"
                );
            }

            return new
            {
                CreationRequestId = creationReq.Id,
                CreationRequestStatus = creationReq.Status.ToString(),
                CreatedPolicyProductId = product.Id
            };
        }
    }
}