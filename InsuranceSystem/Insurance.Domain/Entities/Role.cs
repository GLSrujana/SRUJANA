using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class Role : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Navigation property (One Role -> Many Users)
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
