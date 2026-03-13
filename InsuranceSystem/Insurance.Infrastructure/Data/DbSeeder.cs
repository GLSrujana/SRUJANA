using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Insurance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAsync(InsuranceDbContext context)
        {
            // If roles already exist, do nothing
            if (await context.Roles.AnyAsync())
                return;

            var roles = new List<Role>
            {
                new Role
                {
                    Name = "Admin",
                    Description = "System Administrator"
                },
                new Role
                {
                    Name = "Agent",
                    Description = "Insurance Agent"
                },
                new Role
                {
                    Name = "Customer",
                    Description = "Event Insurance Customer"
                },
                new Role
                {
                    Name = "ClaimsOfficer",
                    Description = "Claims Review Officer"
                }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }
    }
}
