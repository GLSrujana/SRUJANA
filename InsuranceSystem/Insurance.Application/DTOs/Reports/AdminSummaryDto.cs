namespace Insurance.Application.DTOs.Reports
{
    public class AdminSummaryDto
    {
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalAgents { get; set; }
        public int TotalRequests { get; set; }
        public int AssignedRequests { get; set; }
        public int TotalPolicyApplications { get; set; }
        public int ApprovedApplications { get; set; }
        public int TotalActivePolicies { get; set; }
        public int TotalPayments { get; set; }
        public decimal TotalPaymentAmount { get; set; }
        public decimal TotalCommissionGenerated { get; set; }
        public int TotalClaims { get; set; }
        public int PendingClaims { get; set; }

        // Analytics Data
        public Dictionary<string, int> RequestsByEventType { get; set; } = new();
        public Dictionary<string, decimal> RevenueByMonth { get; set; } = new();
        public int ApprovedClaims { get; set; }
        public int RejectedClaims { get; set; }
    }
}