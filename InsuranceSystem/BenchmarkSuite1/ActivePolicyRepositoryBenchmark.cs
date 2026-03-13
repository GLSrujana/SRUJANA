using BenchmarkDotNet.Attributes;
using Insurance.Domain.Entities;
using Insurance.Infrastructure.Data;
using Insurance.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Insurance.Infrastructure.Benchmarks
{
    public class ActivePolicyRepositoryBenchmark
    {
        private InsuranceDbContext _dbContext;
        private ActivePolicyRepository _repository;
        [GlobalSetup]
        public async Task Setup()
        {
            var options = new DbContextOptionsBuilder<InsuranceDbContext>().UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=InsuranceDb;Trusted_Connection=true;").Options;
            _dbContext = new InsuranceDbContext(options);
            _repository = new ActivePolicyRepository(_dbContext);
            // Ensure database is created
            await _dbContext.Database.EnsureCreatedAsync();
        }

        [Benchmark]
        public async Task GetByCustomerAsync_Benchmark()
        {
            // Using a test customer ID - adjust as needed
            var result = await _repository.GetByCustomerAsync(customerId: 1);
        }

        [GlobalCleanup]
        public async Task Cleanup()
        {
            await _dbContext.DisposeAsync();
        }
    }
}