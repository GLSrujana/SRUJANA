using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class InsuranceRequestRepository : IInsuranceRequestRepository
    {
        private readonly InsuranceDbContext _db;

        public InsuranceRequestRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        //receives insurance request entity created in the service layer
        public async Task AddRequestAsync(InsuranceRequest request)
            => await _db.InsuranceRequests.AddAsync(request);

        public Task SaveChangesAsync()
            => _db.SaveChangesAsync();

        public async Task<InsuranceRequest?> GetByIdAsync(int requestId)
        {
            var request = await _db.InsuranceRequests
                .Include(r => r.Customer)
                .Include(r => r.AssignedAgent)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (request != null)
            {
                request.RequestEventDetail = await _db.RequestEventDetails
                    .Where(d => d.InsuranceRequestId == requestId)
                    .Select(d => new RequestEventDetail {
                        Id = d.Id,
                        InsuranceRequestId = d.InsuranceRequestId,
                        EventType = d.EventType,
                        EventDate = d.EventDate,
                        DurationInHours = d.DurationInHours,
                        Location = d.Location,
                        ExpectedAttendees = d.ExpectedAttendees,
                        EventBudget = d.EventBudget,
                        IsOutdoorVenue = d.IsOutdoorVenue,
                        HasFireworks = d.HasFireworks,
                        HasVipPresence = d.HasVipPresence,
                        AlcoholServed = d.AlcoholServed,
                        SpecialNotes = d.SpecialNotes,
                        DocumentType = d.DocumentType
                    })
                    .FirstOrDefaultAsync();
            }
            return request;
        }

        public async Task<InsuranceRequest?> GetByIdWithDocumentAsync(int requestId)
            => await _db.InsuranceRequests
                .AsSplitQuery()
                .Include(r => r.RequestEventDetail)
                .Include(r => r.Customer)
                .Include(r => r.AssignedAgent)
                .FirstOrDefaultAsync(r => r.Id == requestId);

        public async Task<List<InsuranceRequest>> GetUnassignedRequestsAsync()
        {
            var requests = await _db.InsuranceRequests
                .Where(r => r.AssignedAgentId == null)
                .AsSplitQuery()
                .AsNoTracking()
                .Include(r => r.Customer)
                .OrderByDescending(r => r.SubmittedAtUtc)
                .ToListAsync();

            await PopulateEventDetailsAsync(requests);
            return requests;
        }

        public async Task<List<InsuranceRequest>> GetRequestsAssignedToAgentAsync(int agentId)
        {
            var requests = await _db.InsuranceRequests
                .Where(r => r.AssignedAgentId == agentId)
                .AsSplitQuery()
                .AsNoTracking()
                .Include(r => r.Customer)
                .Include(r => r.AssignedAgent)
                .OrderByDescending(r => r.SubmittedAtUtc)
                .ToListAsync();

            await PopulateEventDetailsAsync(requests);
            return requests;
        }

        public async Task<List<InsuranceRequest>> GetRequestsByCustomerAsync(int customerId)
        {
            var requests = await _db.InsuranceRequests
                .Where(r => r.CustomerId == customerId)
                .AsSplitQuery()
                .AsNoTracking()
                .Include(r => r.Customer)
                .Include(r => r.AssignedAgent)
                .OrderByDescending(r => r.SubmittedAtUtc)
                .ToListAsync();

            await PopulateEventDetailsAsync(requests);
            return requests;
        }

        public async Task<int?> GetSingleAdminUserIdAsync()
        {
            var adminRoleId = await _db.Roles
                .Where(r => r.Name == "Admin")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            if (adminRoleId == 0) return null;

            return await _db.Users
                .Where(u => u.RoleId == adminRoleId)
                .Select(u => (int?)u.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<int?> GetCustomerIdByRequestIdAsync(int requestId)
        {
            return await _db.InsuranceRequests
                .Where(r => r.Id == requestId)
                .Select(r => (int?)r.CustomerId)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> AssignAgentAsync(int requestId, int agentId, int adminId, string? adminRemarks)
        {
            var request = await _db.InsuranceRequests.FirstOrDefaultAsync(r => r.Id == requestId);
            if (request == null) return false;

            request.AssignedAgentId = agentId;
            request.AssignedAtUtc = DateTime.UtcNow;
            request.AdminRemarks = adminRemarks;
            request.Status = RequestStatus.Assigned;

            _db.AgentAssignments.Add(new AgentAssignment
            {
                InsuranceRequestId = requestId,
                AgentId = agentId,
                AssignedByAdminId = adminId,
                AssignedAtUtc = DateTime.UtcNow,
                IsActive = true
            });

            return true;
        }

        private async Task PopulateEventDetailsAsync(List<InsuranceRequest> requests)
        {
            var reqIds = requests.Select(r => r.Id).ToList();
            if (!reqIds.Any()) return;

            var details = await _db.RequestEventDetails
                .Where(d => reqIds.Contains(d.InsuranceRequestId))
                .Select(d => new RequestEventDetail {
                    Id = d.Id,
                    InsuranceRequestId = d.InsuranceRequestId,
                    EventType = d.EventType,
                    EventDate = d.EventDate,
                    DurationInHours = d.DurationInHours,
                    Location = d.Location,
                    ExpectedAttendees = d.ExpectedAttendees,
                    EventBudget = d.EventBudget,
                    IsOutdoorVenue = d.IsOutdoorVenue,
                    HasFireworks = d.HasFireworks,
                    HasVipPresence = d.HasVipPresence,
                    AlcoholServed = d.AlcoholServed,
                    SpecialNotes = d.SpecialNotes,
                    DocumentType = d.DocumentType
                })
                .ToListAsync();

            foreach (var r in requests)
            {
                r.RequestEventDetail = details.FirstOrDefault(d => d.InsuranceRequestId == r.Id);
            }
        }
    }
}