using Insurance.Application.DTOs.PolicyProducts;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;

namespace Insurance.Application.Services
{
    /// <summary>
    /// Service dealing directly with base Policy Products (templates).
    /// Used almost exclusively by Administrators to govern the core offerings, 
    /// baseline rates, and minimum/maximum coverage values that Agents can propose.
    /// </summary>
    public class PolicyProductService : IPolicyProductService
    {
        private readonly IPolicyProductRepository _repo;

        public PolicyProductService(IPolicyProductRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Admin mechanism for generating a new generic policy that can handle unique event types
        /// or varying coverage scopes.
        /// </summary>
        /// <param name="adminId">Foreign key tracking who configured this product</param>
        /// <param name="dto">The parameters encapsulating bounds and risk ratios</param>
        /// <returns>A mapped output of the newly created item</returns>
        public async Task<PolicyProductResponseDto> CreateAsync(int adminId, CreatePolicyProductDto dto)
        {
            var product = new PolicyProduct
            {
                ProductName = dto.ProductName.Trim(),
                EventTypeSupported = dto.EventTypeSupported.Trim(),
                BaseRate = dto.BaseRate,
                MinCoverageAmount = dto.MinCoverageAmount,
                MaxCoverageAmount = dto.MaxCoverageAmount,
                Description = dto.Description,
                IsActive = dto.IsActive,

                // IMPORTANT: Use your actual property name here
                CreatedByAdminID = adminId
            };

            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();

            return Map(product);
        }

        public async Task<List<PolicyProductResponseDto>> GetAllAsync(bool? isActive)
        {
            var products = await _repo.GetAllAsync(isActive);
            return products.Select(Map).ToList();
        }

        public async Task<PolicyProductResponseDto?> GetByIdAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            return product == null ? null : Map(product);
        }

        public async Task<PolicyProductResponseDto> UpdateAsync(int id, UpdatePolicyProductDto dto)
        {
            var product = await _repo.GetByIdAsync(id)
                          ?? throw new Exception("Policy product not found.");

            product.ProductName = dto.ProductName.Trim();
            product.EventTypeSupported = dto.EventTypeSupported.Trim();
            product.BaseRate = dto.BaseRate;
            product.MinCoverageAmount = dto.MinCoverageAmount;
            product.MaxCoverageAmount = dto.MaxCoverageAmount;
            product.Description = dto.Description;
            product.IsActive = dto.IsActive;

            await _repo.SaveChangesAsync();

            return Map(product);
        }

        public async Task<PolicyProductResponseDto> SetActiveAsync(int id, bool isActive)
        {
            var product = await _repo.GetByIdAsync(id)
                          ?? throw new Exception("Policy product not found.");

            product.IsActive = isActive;
            await _repo.SaveChangesAsync();

            return Map(product);
        }

        private static PolicyProductResponseDto Map(PolicyProduct p)
        {
            return new PolicyProductResponseDto
            {
                Id = p.Id,
                ProductName = p.ProductName,
                EventTypeSupported = p.EventTypeSupported,
                BaseRate = p.BaseRate,
                MinCoverageAmount = p.MinCoverageAmount,
                MaxCoverageAmount = p.MaxCoverageAmount,
                Description = p.Description,
                IsActive = p.IsActive,
                CreatedByAdminId = p.CreatedByAdminID // use your real property name
            };
        }
    }
}