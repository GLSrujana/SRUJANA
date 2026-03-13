using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Insurance.Domain.Common;
using Insurance.Domain.Entities;

namespace Insurance.Domain.Entities
{
    public class PolicyProduct: BaseEntity
    {
        public string ProductName { get; set; } = string.Empty;

        // For Event Insurance: Wedding, Concert, Corporate, etc.
        public string EventTypeSupported { get; set; } = string.Empty;

        public decimal BaseRate { get; set; }  // e.g., 0.02 (2%)
        public decimal MinCoverageAmount { get; set; }
        public decimal MaxCoverageAmount { get; set; }

        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        public int CreatedByAdminID { get; set; }
        public User CreatedByAdmin { get; set; } = null!;
    }
}
