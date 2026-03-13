using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class RequestEventDetail : BaseEntity
    {
        public int InsuranceRequestId { get; set; }
        public InsuranceRequest InsuranceRequest { get; set; } = null!;

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