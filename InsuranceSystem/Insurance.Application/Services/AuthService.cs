using Insurance.Application.DTOs.Auth;
using Insurance.Application.Interfaces;
//using Insurance.Application.Interfaces.Auth;
using Insurance.Domain.Entities;

namespace Insurance.Application.Services
{
    /// <summary>
    /// Service responsible for handling user authentication operations,
    /// including registering new Customer users and logging in existing users manually.
    /// This service interacts closely with the UserRepository and JwtTokenGenerator.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IRoleRepository _roleRepo;
        private readonly IJwtTokenGenerator _tokenGenerator;

        public AuthService(
            IUserRepository userRepo,
            IRoleRepository roleRepo,
            IJwtTokenGenerator tokenGenerator)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _tokenGenerator = tokenGenerator;
        }

        /// <summary>
        /// Registers a new user with the "Customer" role by default.
        /// Performs basic validation including ensuring the email does not already exist.
        /// </summary>
        /// <param name="request">The Registration payload containing Name, Email, and Password</param>
        /// <returns>A full AuthResponseDto including the generated JWT session token</returns>
        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // 1) Basic cleanup
            var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
            var fullName = (request.FullName ?? string.Empty).Trim();
            var password = request.Password ?? string.Empty;

            if (string.IsNullOrWhiteSpace(email))
                throw new Exception("Email is required.");
            if (string.IsNullOrWhiteSpace(fullName))
                throw new Exception("Full name is required.");
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                throw new Exception("Password must be at least 6 characters.");

            // 2) SECURITY: Public registration is Customer only
            const string roleName = "Customer";

            // 3) Check email uniqueness
            if (await _userRepo.EmailExistsAsync(email))
                throw new Exception("Email already exists.");

            // 4) Get role from DB (must be seeded)
            var role = await _roleRepo.GetByNameAsync(roleName);
            if (role == null)
                throw new Exception("Default role not found. Please seed roles first.");

            // 5) Create user
            var user = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                RoleId = role.Id,
                IsActive = true,
                FailedLoginAttempts = 0,
                LockoutEndUtc = null
            };

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();

            // 6) Generate JWT
            var (token, expiresAtUtc) = _tokenGenerator.GenerateToken(user, role.Name);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = role.Name,
                Token = token,
                ExpiresAtUtc = expiresAtUtc
            };
        }

        /// <summary>
        /// Attempts to authenticate an existing user within the system.
        /// Verifies the hashed password and implements a basic anti-brute-force lockout mechanism.
        /// </summary>
        /// <param name="request">The login payload containing Email and Password</param>
        /// <returns>A full AuthResponseDto containing the generated JWT and Role context</returns>
        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
            var password = request.Password ?? string.Empty;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                throw new Exception("Email and password are required.");

            // Load user with Role
            var user = await _userRepo.GetByEmailWithRoleAsync(email);
            if (user == null || !user.IsActive)
                throw new Exception("Invalid email or password.");

            // Optional lockout check
            if (user.LockoutEndUtc.HasValue && user.LockoutEndUtc.Value > DateTime.UtcNow)
                throw new Exception("Account is locked. Try again later.");

            var passwordOk = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!passwordOk)
            {
                // OPTIONAL: simple lockout logic
                user.FailedLoginAttempts += 1;

                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEndUtc = DateTime.UtcNow.AddMinutes(10);
                }

                await _userRepo.SaveChangesAsync();
                throw new Exception("Invalid email or password.");
            }

            // Reset failed attempts on success
            user.FailedLoginAttempts = 0;
            user.LockoutEndUtc = null;
            await _userRepo.SaveChangesAsync();

            var roleName = user.Role?.Name ?? "Customer";
            var (token, expiresAtUtc) = _tokenGenerator.GenerateToken(user, roleName);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = roleName,
                Token = token,
                ExpiresAtUtc = expiresAtUtc
            };
        }
    }
}