using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.PolicySuggestions;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;

namespace Insurance.Tests.Services
{
    public class PolicySuggestionServiceTests
    {
        [Fact]
        public async Task CreateSuggestionsAsync_WhenRequestNotFound_ThrowsException()
        {
            var suggRepoMock = new Mock<IPolicySuggestionRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            reqRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((InsuranceRequest)null);

            var service = new PolicySuggestionService(suggRepoMock.Object, prodRepoMock.Object, reqRepoMock.Object, notifMock.Object);

            var dto = new CreatePolicySuggestionDto { InsuranceRequestId = 1 };
            await Assert.ThrowsAsync<Exception>(() => service.CreateSuggestionsAsync(1, dto));
        }

        [Fact]
        public async Task CreateSuggestionsAsync_WhenAgentNotAssigned_ThrowsException()
        {
            var suggRepoMock = new Mock<IPolicySuggestionRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            var req = new InsuranceRequest { Id = 1, AssignedAgentId = 2 }; // Agent 2
            reqRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(req);

            var service = new PolicySuggestionService(suggRepoMock.Object, prodRepoMock.Object, reqRepoMock.Object, notifMock.Object);

            var dto = new CreatePolicySuggestionDto { InsuranceRequestId = 1 };
            // Request is from agent 1
            await Assert.ThrowsAsync<Exception>(() => service.CreateSuggestionsAsync(1, dto));
        }

        [Fact]
        public async Task CreateSuggestionsAsync_Success_CreatesNotifiesUpdates()
        {
            var suggRepoMock = new Mock<IPolicySuggestionRepository>();
            var prodRepoMock = new Mock<IPolicyProductRepository>();
            var reqRepoMock = new Mock<IInsuranceRequestRepository>();
            var notifMock = new Mock<INotificationService>();

            var req = new InsuranceRequest { Id = 1, AssignedAgentId = 99, CustomerId = 10, Status = RequestStatus.Assigned };
            reqRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(req);

            var suggestions = new List<PolicySuggestion>
            {
                new PolicySuggestion { Id = 1, PolicyProductId = 5 }
            };
            suggRepoMock.Setup(r => r.GetByRequestIdAsync(1)).ReturnsAsync(suggestions);

            var service = new PolicySuggestionService(suggRepoMock.Object, prodRepoMock.Object, reqRepoMock.Object, notifMock.Object);

            var dto = new CreatePolicySuggestionDto 
            { 
                InsuranceRequestId = 1, 
                Suggestions = new List<PolicySuggestionItemDto> 
                { 
                    new PolicySuggestionItemDto { PolicyProductId = 5, PremiumYearly = 1200 } 
                }
            };
            
            var result = await service.CreateSuggestionsAsync(99, dto);

            // Verifications
            suggRepoMock.Verify(s => s.AddRangeAsync(It.IsAny<List<PolicySuggestion>>()), Times.Once);
            suggRepoMock.Verify(s => s.SaveChangesAsync(), Times.Once);

            notifMock.Verify(n => n.CreateAsync(10, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);

            Assert.Equal(RequestStatus.SuggestionsSent, req.Status);
            reqRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);

            Assert.Single(result);
            Assert.Equal(5, result[0].PolicyProductId);
        }
    }
}
