using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Insurance.Infrastructure.Data
{
    public class InsuranceDesignTimeDbContextFactory : IDesignTimeDbContextFactory<InsuranceDbContext>
    {
        public InsuranceDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<InsuranceDbContext>();
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=InsuranceDb;Trusted_Connection=True;TrustServerCertificate=True;");

            return new InsuranceDbContext(optionsBuilder.Options);
        }
    }
}
