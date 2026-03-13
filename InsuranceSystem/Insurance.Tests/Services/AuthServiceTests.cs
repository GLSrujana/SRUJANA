using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Insurance.Application.Services;
using Insurance.Application.Interfaces;
using Insurance.Application.DTOs.Auth;
using Insurance.Domain.Entities;

namespace Insurance.Tests.Services
{
    public class AuthServiceTests
    {
        [Fact]
        public async Task RegisterAsync_WhenEmailExists_ThrowsException()
        {
            var userRepoMock = new Mock<IUserRepository>();
            var roleRepoMock = new Mock<IRoleRepository>();
            var tokenMock = new Mock<IJwtTokenGenerator>();

            userRepoMock.Setup(r => r.EmailExistsAsync("test@test.com")).ReturnsAsync(true);

            var service = new AuthService(userRepoMock.Object, roleRepoMock.Object, tokenMock.Object);

            var dto = new RegisterRequestDto 
            {
                Email = "test@test.com",
                FullName = "Test",
                Password = "password123"
            };

            var ex = await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(dto));
            Assert.Equal("Email already exists.", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_WhenUserNotFound_ThrowsException()
        {
            var userRepoMock = new Mock<IUserRepository>();
            var roleRepoMock = new Mock<IRoleRepository>();
            var tokenMock = new Mock<IJwtTokenGenerator>();

            userRepoMock.Setup(r => r.GetByEmailWithRoleAsync("test@test.com")).ReturnsAsync((User)null);

            var service = new AuthService(userRepoMock.Object, roleRepoMock.Object, tokenMock.Object);

            var dto = new LoginRequestDto
            {
                Email = "test@test.com",
                Password = "password123"
            };

            var ex = await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(dto));
            Assert.Equal("Invalid email or password.", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_WhenPasswordInvalid_IncrementsFailedAttempts()
        {
            var userRepoMock = new Mock<IUserRepository>();
            var roleRepoMock = new Mock<IRoleRepository>();
            var tokenMock = new Mock<IJwtTokenGenerator>();

            var user = new User 
            { 
                Email = "test@test.com", 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword"),
                IsActive = true,
                FailedLoginAttempts = 0
            };

            userRepoMock.Setup(r => r.GetByEmailWithRoleAsync("test@test.com")).ReturnsAsync(user);

            var service = new AuthService(userRepoMock.Object, roleRepoMock.Object, tokenMock.Object);

            var dto = new LoginRequestDto
            {
                Email = "test@test.com",
                Password = "wrongpassword"
            };

            var ex = await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(dto));
            Assert.Equal("Invalid email or password.", ex.Message);
            Assert.Equal(1, user.FailedLoginAttempts);
            userRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
