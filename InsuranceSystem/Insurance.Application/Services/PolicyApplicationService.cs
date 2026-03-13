using Insurance.Application.DTOs.PolicyApplications;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Application.Services
{
    public class PolicyApplicationService : IPolicyApplicationService
    {
        private readonly IPolicyApplicationRepository _appRepo;
        private readonly IInsuranceRequestRepository _requestRepo;
        private readonly IPolicyProductRepository _productRepo;
        private readonly IActivePolicyRepository _activePolicyRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IAgentCommissionRepository _commissionRepo;
        private readonly INotificationService _notif;

        // Agent commission rate: 10% of premium
        private const decimal AgentCommissionRate = 0.10m;

        public PolicyApplicationService(
            IPolicyApplicationRepository appRepo,
            IInsuranceRequestRepository requestRepo,
            IPolicyProductRepository productRepo,
            IActivePolicyRepository activePolicyRepo,
            IPaymentRepository paymentRepo,
            IAgentCommissionRepository commissionRepo,
            INotificationService notif)
        {
            _appRepo = appRepo;
            _requestRepo = requestRepo;
            _productRepo = productRepo;
            _activePolicyRepo = activePolicyRepo;
            _paymentRepo = paymentRepo;
            _commissionRepo = commissionRepo;
            _notif = notif;
        }

        public async Task<PolicyApplicationResponseDto> SelectPolicyAsync(int customerId, SelectPolicyDto dto)
        {
            // request must exist
            var req = await _requestRepo.GetByIdAsync(dto.InsuranceRequestId)
                      ?? throw new Exception("Insurance request not found.");

            // must belong to this customer
            if (req.CustomerId != customerId)
                throw new Exception("You are not allowed to select policy for this request.");

            // must be assigned to an agent
            if (req.AssignedAgentId == null)
                throw new Exception("Agent is not assigned yet.");

            // request should not already be converted
            if (await _appRepo.ExistsForRequestAsync(dto.InsuranceRequestId))
                throw new Exception("Policy application already created for this request.");

            // policy product must exist + active
            var product = await _productRepo.GetByIdAsync(dto.PolicyProductId)
                          ?? throw new Exception("Policy product not found.");

            if (!product.IsActive)
                throw new Exception("Selected policy product is inactive.");

            // Get event details for risk-based premium calculation
            var eventDetail = req.RequestEventDetail;

            // Compute premium using risk engine
            decimal premium = PremiumCalculator.Calculate(
                coverageAmount: dto.CoverageAmount,
                baseRate: product.BaseRate,
                expectedAttendees: eventDetail?.ExpectedAttendees ?? 100,
                durationInHours: eventDetail?.DurationInHours ?? 4,
                isOutdoor: eventDetail?.IsOutdoorVenue ?? false,
                hasFireworks: eventDetail?.HasFireworks ?? false,
                hasVipPresence: eventDetail?.HasVipPresence ?? false,
                alcoholServed: eventDetail?.AlcoholServed ?? false
            );

            // Calculate PremiumPerPayment
            decimal premiumPerPayment = premium;
            string paymentOption = string.IsNullOrEmpty(dto.PaymentOption) ? "Yearly" : dto.PaymentOption;
            if (paymentOption == "Monthly") premiumPerPayment = premium / 12m;
            else if (paymentOption == "SixMonths") premiumPerPayment = premium / 2m;

            // create application
            var app = new PolicyApplication
            {
                InsuranceRequestId = dto.InsuranceRequestId,
                CustomerId = customerId,
                AgentId = req.AssignedAgentId.Value,
                PolicyProductId = dto.PolicyProductId,
                CoverageAmount = dto.CoverageAmount,
                CalculatedPremium = premium,
                PaymentOption = paymentOption,
                PremiumAmountPerPayment = premiumPerPayment,
                Status = ApplicationStatus.SubmittedByCustomer,
                CreatedAtUtc = DateTime.UtcNow
            };

            await _appRepo.AddAsync(app);
            await _appRepo.SaveChangesAsync();

            // Update request status to ConvertedToApplication
            req.Status = Insurance.Domain.Enums.RequestStatus.ConvertedToApplication;
            await _requestRepo.SaveChangesAsync();

            // Notify Admin
            var adminId = await _requestRepo.GetSingleAdminUserIdAsync();
            if (adminId.HasValue)
            {
                await _notif.CreateAsync(
                    userId: adminId.Value,
                    title: "New Policy Application",
                    message: $"Customer #{customerId} has submitted a new policy application (App ID: {app.Id}).",
                    type: "ApplicationUpdate"
                );
            }

            return Map(app);
        }

        public async Task<List<PolicyApplicationResponseDto>> GetMyApplicationsAsync(int customerId)
        {
            var list = await _appRepo.GetByCustomerAsync(customerId);
            return list.Select(Map).ToList();
        }

        public async Task<List<PolicyApplicationResponseDto>> GetPendingAsync()
        {
            var list = await _appRepo.GetByStatusAsync(ApplicationStatus.SubmittedByCustomer);
            return list.Select(Map).ToList();
        }

        public async Task<PolicyApplicationResponseDto> ApproveAsync(int applicationId, DTOs.PolicyApplications.ApprovePolicyDto? dto = null)
        {
            var app = await _appRepo.GetByIdAsync(applicationId)
                      ?? throw new Exception("Application not found.");

            // If admin provided a premium override, apply it
            if (dto?.Premium != null && dto.Premium > 0)
            {
                app.CalculatedPremium = dto.Premium.Value;
                app.PremiumAmountPerPayment = app.PaymentOption == "Monthly" ? app.CalculatedPremium / 12m :
                                              app.PaymentOption == "SixMonths" ? app.CalculatedPremium / 2m :
                                              app.CalculatedPremium;
            }

            // Change status
            app.Status = ApplicationStatus.ApprovedByAdmin;
            await _appRepo.SaveChangesAsync();

            // Create ActivePolicy, Payment, and AgentCommission if not already created
            var existingPolicy = await _activePolicyRepo.GetByApplicationIdAsync(app.Id);
            if (existingPolicy == null)
            {
                var policy = new ActivePolicy
                {
                    PolicyApplicationId = app.Id,
                    CustomerId = app.CustomerId,
                    AgentId = app.AgentId,
                    PolicyNumber = $"EVT-{DateTime.UtcNow:yyyyMMdd}-{app.Id}",
                    StartDateUtc = DateTime.UtcNow,
                    EndDateUtc = DateTime.UtcNow.AddYears(1),
                    Status = PolicyStatus.Active,
                    TotalPremium = app.CalculatedPremium,
                    PaymentOption = app.PaymentOption,
                    PremiumAmountPerPayment = app.PremiumAmountPerPayment
                };

                await _activePolicyRepo.AddAsync(policy);
                await _activePolicyRepo.SaveChangesAsync();

                // Create Installment Payment records
                int installmentCount = app.PaymentOption == "Monthly" ? 12 :
                                       app.PaymentOption == "SixMonths" ? 2 : 1;

                for (int i = 1; i <= installmentCount; i++)
                {
                    var dueDate = app.PaymentOption == "Monthly" ? DateTime.UtcNow.AddMonths(i - 1) :
                                  app.PaymentOption == "SixMonths" ? DateTime.UtcNow.AddMonths((i - 1) * 6) :
                                  DateTime.UtcNow;

                    var payment = new Payment
                    {
                        ActivePolicyId = policy.Id,
                        Amount = app.PremiumAmountPerPayment,
                        Status = PaymentStatus.Pending,
                        DueDateUtc = dueDate,
                        InstallmentNumber = i
                    };
                    await _paymentRepo.AddAsync(payment);
                }
                
                await _paymentRepo.SaveChangesAsync();
            }

            // Notify Customer
            await _notif.CreateAsync(
                userId: app.CustomerId,
                title: "Application Approved",
                message: $"Your policy application (App ID: {app.Id}) has been approved and your policy is now active.",
                type: "ApplicationUpdate"
            );

            return Map(app);
        }

        public async Task<PolicyApplicationResponseDto> RejectAsync(int applicationId)
        {
            var app = await _appRepo.GetByIdAsync(applicationId)
                      ?? throw new Exception("Application not found.");

            app.Status = ApplicationStatus.RejectedByAdmin;
            await _appRepo.SaveChangesAsync();

            // Notify Customer
            await _notif.CreateAsync(
                userId: app.CustomerId,
                title: "Application Rejected",
                message: $"Your policy application (App ID: {app.Id}) has been rejected by the admin.",
                type: "ApplicationUpdate"
            );

            return Map(app);
        }

        private static PolicyApplicationResponseDto Map(PolicyApplication a) => new()
        {
            Id = a.Id,
            InsuranceRequestId = a.InsuranceRequestId,
            PolicyProductId = a.PolicyProductId,
            CoverageAmount = a.CoverageAmount,
            CalculatedPremium = a.CalculatedPremium,
            Status = a.Status,
            PaymentOption = a.PaymentOption,
            PremiumAmountPerPayment = a.PremiumAmountPerPayment
        };
    }
}