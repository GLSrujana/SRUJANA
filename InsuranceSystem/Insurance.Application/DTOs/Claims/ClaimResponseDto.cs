using Insurance.Domain.Enums;

namespace Insurance.Application.DTOs.Claims
{
    public class ClaimResponseDto
    {
        public int Id { get; set; }
        public int ActivePolicyId { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public ClaimStatus Status { get; set; }
        public string ClaimReason { get; set; } = string.Empty;
        public decimal ClaimAmountRequested { get; set; }
        public decimal? ApprovedSettlementAmount { get; set; }
        public string? OfficerRemarks { get; set; }
        public DateTime SubmittedAtUtc { get; set; }

        public string PaymentOption { get; set; } = string.Empty;
        public int TotalInstallments { get; set; }
        public int PaidInstallments { get; set; }

        public int RiskScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public string RiskAnalysis { get; set; } = string.Empty;
    }
}