using Insurance.Application.DTOs.ActivePolicies;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    public class ActivePolicyService : IActivePolicyService
    {
        private readonly IActivePolicyRepository _repo;

        public ActivePolicyService(IActivePolicyRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ActivePolicyResponseDto>> GetMyPoliciesAsync(int customerId)
        {
            var list = await _repo.GetByCustomerAsync(customerId);
            return list.Select(MapToCustomerDto).ToList();
        }

        public async Task<List<AdminActivePolicyDto>> GetAllForAdminAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToAdminDto).ToList();
        }

        private static ActivePolicyResponseDto MapToCustomerDto(ActivePolicy p)
        {
            var paidCount = p.Payments?.Count(x => x.Status == PaymentStatus.Paid) ?? 0;
            var totalCount = p.Payments?.Count ?? 1;
            var nextPayment = p.Payments?
                .Where(x => x.Status == PaymentStatus.Pending)
                .OrderBy(x => x.DueDateUtc)
                .FirstOrDefault();

            return new ActivePolicyResponseDto
            {
                Id = p.Id,
                PolicyNumber = p.PolicyNumber,
                CustomerId = p.CustomerId,
                AgentId = p.AgentId,
                AgentName = p.Agent?.FullName ?? "Unassigned",
                Status = p.Status.ToString(),
                PolicyName = p.PolicyApplication?.PolicyProduct?.ProductName ?? "Event Policy",
                TotalPremium = p.TotalPremium,
                CoverageAmount = p.PolicyApplication?.CoverageAmount ?? 0,
                StartDateUtc = p.StartDateUtc,
                EndDateUtc = p.EndDateUtc,
                IsPremiumPaid = paidCount >= totalCount,
                HasClaims = p.Claims?.Any() ?? false,
                ClaimStatus = p.Claims?.FirstOrDefault()?.Status.ToString(),
                ClaimsOfficerName = p.Claims?.FirstOrDefault()?.ReviewedByClaimsOfficer?.FullName,
                EventType = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.EventType,
                EventDate = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.EventDate,
                Location = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.Location,
                IsOutdoorVenue = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.IsOutdoorVenue ?? false,
                HasFireworks = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.HasFireworks ?? false,
                HasVipPresence = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.HasVipPresence ?? false,
                AlcoholServed = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.AlcoholServed ?? false,
                SpecialNotes = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.SpecialNotes,
                PaymentOption = p.PaymentOption,
                TotalInstallments = totalCount,
                PaidInstallments = paidCount,
                NextPaymentDueDate = nextPayment?.DueDateUtc,
                NextPaymentAmount = nextPayment?.Amount ?? 0m
            };
        }

        private static AdminActivePolicyDto MapToAdminDto(ActivePolicy p)
        {
            var paidCount = p.Payments?.Count(x => x.Status == PaymentStatus.Paid) ?? 0;
            var totalCount = p.Payments?.Count ?? 1;

            return new AdminActivePolicyDto
            {
                Id = p.Id,
                PolicyNumber = p.PolicyNumber,
                PolicyName = p.PolicyApplication?.PolicyProduct?.ProductName ?? "Event Policy",
                CustomerName = p.Customer?.FullName ?? $"Customer #{p.CustomerId}",
                AgentName = p.Agent?.FullName ?? $"Agent #{p.AgentId}",
                Status = p.Status.ToString(),
                TotalPremium = p.TotalPremium,
                CoverageAmount = p.PolicyApplication?.CoverageAmount ?? 0,
                StartDateUtc = p.StartDateUtc,
                EndDateUtc = p.EndDateUtc,
                InsuranceRequestId = p.PolicyApplication?.InsuranceRequestId,
                EventType = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.EventType,
                EventDate = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.EventDate,
                Location = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.Location,
                IsOutdoorVenue = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.IsOutdoorVenue ?? false,
                HasFireworks = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.HasFireworks ?? false,
                HasVipPresence = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.HasVipPresence ?? false,
                AlcoholServed = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.AlcoholServed ?? false,
                SpecialNotes = p.PolicyApplication?.InsuranceRequest?.RequestEventDetail?.SpecialNotes,
                HasClaims = p.Claims?.Any() ?? false,
                ClaimsOfficerName = p.Claims?.FirstOrDefault()?.ReviewedByClaimsOfficer?.FullName,
                ClaimStatus = p.Claims?.FirstOrDefault()?.Status.ToString(),
                PaymentOption = p.PaymentOption,
                PremiumAmountPerPayment = p.PremiumAmountPerPayment,
                TotalInstallments = totalCount,
                PaidInstallments = paidCount
            };
        }
    }
}