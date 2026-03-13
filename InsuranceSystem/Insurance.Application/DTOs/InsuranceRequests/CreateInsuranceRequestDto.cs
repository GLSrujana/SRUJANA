 using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insurance.Application.DTOs.InsuranceRequests
{
    public class CreateInsuranceRequestDto
    {
        public decimal RequestedCoverageAmount { get; set; }
        public string? PreferredCoverageNotes { get; set; }

        public string EventType { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public int DurationInHours { get; set; }
        public string Location { get; set; } = string.Empty;
        public int ExpectedAttendees { get; set; }
        public decimal EventBudget { get; set; }

        public bool IsOutdoorVenue { get; set; }
        public bool HasFireworks { get; set; }
        public bool HasVipPresence { get; set; }
        public bool AlcoholServed { get; set; }

        public string? SpecialNotes { get; set; }

        public string? DocumentType { get; set; }
        public string? DocumentData { get; set; }
    }
}