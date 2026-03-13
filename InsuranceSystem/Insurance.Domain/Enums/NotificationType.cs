using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insurance.Domain.Enums
{
    public enum NotificationType
    {
        PolicyUpdate = 1,
        PaymentReminder = 2,
        ClaimUpdate = 3,
        General = 4
    }
}