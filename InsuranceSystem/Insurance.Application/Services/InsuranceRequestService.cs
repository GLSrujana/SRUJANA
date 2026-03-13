using Insurance.Application.DTOs.InsuranceRequests;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    /// <summary>
    /// Service managing the main 'Insurance Request' domain entity. 
    /// Handles customer creation of new risk coverage requests, and allows 
    /// the Administrator to assign those requests to specific Agents.
    /// </summary>
    public class InsuranceRequestService : IInsuranceRequestService
    {
        private readonly IInsuranceRequestRepository _repo;
        private readonly INotificationService _notif;

        public InsuranceRequestService(IInsuranceRequestRepository repo, INotificationService notif)
        {
            _repo = repo;
            _notif = notif;
        }

        /// <summary>
        /// Instantiates a new InsuranceRequest from a given DTO and commits it to the database.
        /// Also triggers a system notification signaling the admin of the new request.
        /// </summary>
        /// <param name="customerId">The ID of the Customer initiating the request</param>
        /// <param name="dto">The parameters of the event (date, size, risk factors)</param>
        /// <returns>A mapped response containing the newly generated Request ID</returns>
        public async Task<InsuranceRequestResponseDto> CreateRequestAsync(int customerId, CreateInsuranceRequestDto dto)
        {
            //creates Insurance request object
            var request = new InsuranceRequest
            {
                CustomerId = customerId,
                RequestedCoverageAmount = dto.RequestedCoverageAmount,
                PreferredCoverageNotes = dto.PreferredCoverageNotes,
                Status = RequestStatus.Submitted,
                SubmittedAtUtc = DateTime.UtcNow,
                RequestEventDetail = new RequestEventDetail
                {
                    EventType = dto.EventType,
                    EventDate = dto.EventDate,
                    DurationInHours = dto.DurationInHours,
                    Location = dto.Location,
                    ExpectedAttendees = dto.ExpectedAttendees,
                    EventBudget = dto.EventBudget,
                    IsOutdoorVenue = dto.IsOutdoorVenue,
                    HasFireworks = dto.HasFireworks,
                    HasVipPresence = dto.HasVipPresence,
                    AlcoholServed = dto.AlcoholServed,
                    SpecialNotes = dto.SpecialNotes,
                    DocumentType = dto.DocumentType,
                    DocumentData = dto.DocumentData
                }
            };

            //sends the request object to the repository layer. 
            await _repo.AddRequestAsync(request);

            //save changes to database  
            await _repo.SaveChangesAsync();

            // ✅ Notify Admin: New request submitted (single admin)
            var adminId = await _repo.GetSingleAdminUserIdAsync(); // implement in repo like you did earlier
            if (adminId != null)
            {
                await _notif.CreateAsync(
                    userId: adminId.Value,
                    title: "New insurance request submitted",
                    message: $"Customer submitted a new request (Request ID: {request.Id}).",
                    type: "General"
                );
            }

            return MapToResponse(request);
        }

        public async Task<List<InsuranceRequestResponseDto>> GetCustomerRequestsAsync(int customerId)
        {
            var list = await _repo.GetRequestsByCustomerAsync(customerId);
            return list.Select(r => MapToResponse(r, includeDocumentData: false)).ToList();
        }

        public async Task<List<InsuranceRequestResponseDto>> GetUnassignedRequestsAsync()
        {
            var list = await _repo.GetUnassignedRequestsAsync();
            return list.Select(r => MapToResponse(r, includeDocumentData: false)).ToList();
        }

        /// <summary>
        /// Used strictly by the Administrator to link an unassigned InsuranceRequest sequentially to an Agent.
        /// This ensures the specified Agent processes the quote further down the pipeline.
        /// Sends a notification back to the Agent.
        /// </summary>
        /// <param name="adminId">Admin ID conducting the assignment</param>
        /// <param name="dto">Payload containing the specific Request ID and target Agent ID</param>
        /// <returns>Boolean indicating success</returns>
        public async Task<bool> AssignAgentAsync(int adminId, AssignAgentDto dto)
        {
            var ok = await _repo.AssignAgentAsync(dto.RequestID, dto.AgentID, adminId, dto.AdminRemarks);
            if (!ok) return false;

            await _repo.SaveChangesAsync();

            // ✅ Notify Agent: New request assigned
            await _notif.CreateAsync(
                userId: dto.AgentID,
                title: "New request assigned",
                message: $"You have been assigned Request ID: {dto.RequestID}.",
                type: "PolicyUpdate"
            );

            // Optional: Notify Customer that agent is assigned
            var customerId = await _repo.GetCustomerIdByRequestIdAsync(dto.RequestID); // implement in repo
            if (customerId != null)
            {
                await _notif.CreateAsync(
                    userId: customerId.Value,
                    title: "Agent assigned",
                    message: $"An agent has been assigned to your request (Request ID: {dto.RequestID}).",
                    type: "PolicyUpdate"
                );
            }

            return true;
        }

        public async Task<List<InsuranceRequestResponseDto>> GetAgentAssignedRequestsAsync(int agentId)
        {
            var list = await _repo.GetRequestsAssignedToAgentAsync(agentId);
            return list.Select(r => MapToResponse(r, includeDocumentData: false)).ToList();
        }

        public async Task<bool> UpdateRequestStatusAsync(int agentId, int requestId, RequestStatus status, string? remarks)
        {
            var request = await _repo.GetByIdAsync(requestId);
            if (request == null || request.AssignedAgentId != agentId) return false;

            request.Status = status;
            await _repo.SaveChangesAsync();

            // Notify Customer on trouble
            if (status == RequestStatus.InfoRequired || status == RequestStatus.Rejected)
            {
                var title = status == RequestStatus.InfoRequired ? "Information Required" : "Request Rejected";
                var message = status == RequestStatus.InfoRequired 
                    ? $"Agent requires more information for your request (REQ-{request.Id:D4})."
                    : $"Your insurance request (REQ-{request.Id:D4}) has been rejected.";

                await _notif.CreateAsync(
                    userId: request.CustomerId,
                    title: title,
                    message: message,
                    type: "PolicyUpdate"
                );
            }

            return true;
        }

        public async Task<InsuranceRequestResponseDto?> GetRequestByIdAsync(int userId, int requestId)
        {
            var request = await _repo.GetByIdWithDocumentAsync(requestId);
            if (request == null || (request.CustomerId != userId && request.AssignedAgentId != userId)) 
                return null;

            return MapToResponse(request);
        }

        public async Task<InsuranceRequestResponseDto> CreateDraftAsync(int customerId, CreateInsuranceRequestDto dto)
        {
            var request = new InsuranceRequest
            {
                CustomerId = customerId,
                RequestedCoverageAmount = dto.RequestedCoverageAmount,
                PreferredCoverageNotes = dto.PreferredCoverageNotes,
                Status = RequestStatus.Draft, // Explicitly Draft
                SubmittedAtUtc = DateTime.UtcNow,
                RequestEventDetail = new RequestEventDetail
                {
                    EventType = dto.EventType,
                    EventDate = dto.EventDate,
                    DurationInHours = dto.DurationInHours,
                    Location = dto.Location,
                    ExpectedAttendees = dto.ExpectedAttendees,
                    EventBudget = dto.EventBudget,
                    IsOutdoorVenue = dto.IsOutdoorVenue,
                    HasFireworks = dto.HasFireworks,
                    HasVipPresence = dto.HasVipPresence,
                    AlcoholServed = dto.AlcoholServed,
                    SpecialNotes = dto.SpecialNotes,
                    DocumentType = dto.DocumentType,
                    DocumentData = dto.DocumentData
                }
            };

            await _repo.AddRequestAsync(request);
            await _repo.SaveChangesAsync();
            return MapToResponse(request);
        }

        public async Task<InsuranceRequestResponseDto> UpdateDraftAsync(int customerId, int requestId, CreateInsuranceRequestDto dto)
        {
            var request = await _repo.GetByIdWithDocumentAsync(requestId);
            if (request == null || request.CustomerId != customerId || request.Status != RequestStatus.Draft)
            {
                throw new Exception("Draft not found or already submitted.");
            }

            request.RequestedCoverageAmount = dto.RequestedCoverageAmount;
            request.PreferredCoverageNotes = dto.PreferredCoverageNotes;
            
            if (request.RequestEventDetail != null)
            {
                request.RequestEventDetail.EventType = dto.EventType;
                request.RequestEventDetail.EventDate = dto.EventDate;
                request.RequestEventDetail.DurationInHours = dto.DurationInHours;
                request.RequestEventDetail.Location = dto.Location;
                request.RequestEventDetail.ExpectedAttendees = dto.ExpectedAttendees;
                request.RequestEventDetail.EventBudget = dto.EventBudget;
                request.RequestEventDetail.IsOutdoorVenue = dto.IsOutdoorVenue;
                request.RequestEventDetail.HasFireworks = dto.HasFireworks;
                request.RequestEventDetail.HasVipPresence = dto.HasVipPresence;
                request.RequestEventDetail.AlcoholServed = dto.AlcoholServed;
                request.RequestEventDetail.SpecialNotes = dto.SpecialNotes;
                request.RequestEventDetail.DocumentType = dto.DocumentType;
                request.RequestEventDetail.DocumentData = dto.DocumentData;
            }

            await _repo.SaveChangesAsync();
            return MapToResponse(request);
        }

        public async Task<InsuranceRequestResponseDto> SubmitDraftAsync(int customerId, int requestId, CreateInsuranceRequestDto dto)
        {
            var request = await _repo.GetByIdWithDocumentAsync(requestId);
            if (request == null || request.CustomerId != customerId || request.Status != RequestStatus.Draft)
            {
                throw new Exception("Draft not found or already submitted.");
            }

            // Update data
            request.RequestedCoverageAmount = dto.RequestedCoverageAmount;
            request.PreferredCoverageNotes = dto.PreferredCoverageNotes;
            request.Status = RequestStatus.Submitted; // Finalize
            request.SubmittedAtUtc = DateTime.UtcNow;

            if (request.RequestEventDetail != null)
            {
                request.RequestEventDetail.EventType = dto.EventType;
                request.RequestEventDetail.EventDate = dto.EventDate;
                request.RequestEventDetail.DurationInHours = dto.DurationInHours;
                request.RequestEventDetail.Location = dto.Location;
                request.RequestEventDetail.ExpectedAttendees = dto.ExpectedAttendees;
                request.RequestEventDetail.EventBudget = dto.EventBudget;
                request.RequestEventDetail.IsOutdoorVenue = dto.IsOutdoorVenue;
                request.RequestEventDetail.HasFireworks = dto.HasFireworks;
                request.RequestEventDetail.HasVipPresence = dto.HasVipPresence;
                request.RequestEventDetail.AlcoholServed = dto.AlcoholServed;
                request.RequestEventDetail.SpecialNotes = dto.SpecialNotes;
                request.RequestEventDetail.DocumentType = dto.DocumentType;
                request.RequestEventDetail.DocumentData = dto.DocumentData;
            }

            await _repo.SaveChangesAsync();

            // ✅ Notify Admin: New request finalized from draft
            var adminId = await _repo.GetSingleAdminUserIdAsync();
            if (adminId != null)
            {
                await _notif.CreateAsync(
                    userId: adminId.Value,
                    title: "New insurance request submitted",
                    message: $"Customer finalized a draft (Request ID: {request.Id}).",
                    type: "General"
                );
            }

            return MapToResponse(request);
        }

        private static InsuranceRequestResponseDto MapToResponse(InsuranceRequest r, bool includeDocumentData = true)
        {
            return new InsuranceRequestResponseDto
            {
                RequestId = r.Id,
                CustomerId = r.CustomerId,
                CustomerName = r.Customer?.FullName ?? string.Empty,
                AssignedAgentId = r.AssignedAgentId,
                AssignedAgentName = r.AssignedAgent?.FullName,
                RequestedCoverageAmount = r.RequestedCoverageAmount,
                PreferredCoverageNotes = r.PreferredCoverageNotes,
                EventType = r.RequestEventDetail?.EventType,
                EventDate = r.RequestEventDetail?.EventDate,
                Location = r.RequestEventDetail?.Location ?? string.Empty,
                ExpectedAttendees = r.RequestEventDetail?.ExpectedAttendees ?? 0,
                EventBudget = r.RequestEventDetail?.EventBudget ?? 0,
                DurationInHours = r.RequestEventDetail?.DurationInHours ?? 0,
                IsOutdoorVenue = r.RequestEventDetail?.IsOutdoorVenue ?? false,
                HasFireworks = r.RequestEventDetail?.HasFireworks ?? false,
                HasVipPresence = r.RequestEventDetail?.HasVipPresence ?? false,
                AlcoholServed = r.RequestEventDetail?.AlcoholServed ?? false,
                SpecialNotes = r.RequestEventDetail?.SpecialNotes,
                DocumentType = r.RequestEventDetail?.DocumentType,
                DocumentData = includeDocumentData ? r.RequestEventDetail?.DocumentData : null,
                Status = r.Status,
                SubmittedAtUtc = r.SubmittedAtUtc,
                AssignedClaimsOfficerName = r.Status == RequestStatus.Closed ? "Settled" : null
            };
        }
    }
}