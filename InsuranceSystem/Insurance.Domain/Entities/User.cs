using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; } = true;

        public int FailedLoginAttempts { get; set; } = 0;

        public DateTime? LockoutEndUtc { get; set; }

        // Foreign Key
        public int RoleId { get; set; }

        // Navigation property
        public Role Role { get; set; } = null!;

        public ICollection<InsuranceRequest> CustomerInsuranceRequests { get; set; } = new List<InsuranceRequest>();
        public ICollection<InsuranceRequest> AssignedInsuranceRequests { get; set; } = new List<InsuranceRequest>();

        public ICollection<AgentAssignment> AgentAssignments { get; set; } = new List<AgentAssignment>();
        public ICollection<AgentAssignment> AdminAssignedRequests { get; set; } = new List<AgentAssignment>();
    }
}