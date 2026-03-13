using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insurance.Domain.Enums
{
    public enum ApplicationStatus
    {
        Draft = 1,
        SubmittedByCustomer = 2,
        ForwardedByAgent = 3,
        ApprovedByAdmin = 4,
        RejectedByAdmin = 5
    }
}