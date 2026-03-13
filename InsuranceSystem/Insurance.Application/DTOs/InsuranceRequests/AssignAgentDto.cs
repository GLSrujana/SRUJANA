using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insurance.Application.DTOs.InsuranceRequests
{
    public class AssignAgentDto
    {
        [Required]
        public int RequestID { get; set; }

        [Required]
        public int AgentID { get; set; }

        public string? AdminRemarks { get; set; }
        //public int AssignedByAdminID { get; set; }
    }
}
