using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Insurance.Domain.Enums;

namespace Insurance.Application.DTOs.InsuranceRequests
{
    public class InsuranceRequestResponseDto
    {
        public int RequestId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        public int? AssignedAgentId { get; set; }
        public string? AssignedAgentName { get; set; }
        public string? AssignedClaimsOfficerName { get; set; }

        public decimal RequestedCoverageAmount { get; set; }
        public string? PreferredCoverageNotes { get; set; }

        public string? EventType { get; set; }
        public DateTime? EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public int ExpectedAttendees { get; set; }
        public decimal EventBudget { get; set; }
        public int DurationInHours { get; set; }
        public bool IsOutdoorVenue { get; set; }
        public bool HasFireworks { get; set; }
        public bool HasVipPresence { get; set; }
        public bool AlcoholServed { get; set; }
        public string? SpecialNotes { get; set; }
        public string? DocumentType { get; set; }
        public string? DocumentData { get; set; }

        public RequestStatus Status { get; set; }
        public DateTime SubmittedAtUtc { get; set; }
    }
}