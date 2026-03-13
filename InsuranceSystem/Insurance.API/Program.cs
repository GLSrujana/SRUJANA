using Insurance.Application.Interfaces;
using Insurance.Application.Services;
using Insurance.Infrastructure.Auth;
using Insurance.Infrastructure.Data;
using Insurance.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

namespace Insurance.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers()
                .AddJsonOptions(options => {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Insurance API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token like: Bearer {your token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });


            //register db context with SQL Server connection string
            builder.Services.AddDbContext<InsuranceDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IInsuranceRequestService, InsuranceRequestService>();
            builder.Services.AddScoped<IInsuranceRequestRepository, InsuranceRequestRepository>();

            builder.Services.AddScoped<IPolicySuggestionRepository, PolicySuggestionRepository>();
            builder.Services.AddScoped<IPolicySuggestionService, PolicySuggestionService>();

            builder.Services.AddScoped<IPolicyProductRepository, PolicyProductRepository>();
            builder.Services.AddScoped<IPolicyProductService, PolicyProductService>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IRoleRepository, RoleRepository>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            builder.Services.AddScoped<IPolicyProductCreationRequestRepository, PolicyProductCreationRequestRepository>();
            builder.Services.AddScoped<IPolicyProductCreationRequestService, PolicyProductCreationRequestService>();

            builder.Services.AddScoped<IPolicyApplicationRepository, PolicyApplicationRepository>();
            builder.Services.AddScoped<IPolicyApplicationService, PolicyApplicationService>();

            builder.Services.AddScoped<IActivePolicyRepository, ActivePolicyRepository>();

            builder.Services.AddScoped<IActivePolicyService, ActivePolicyService>();

            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<ICommissionService, CommissionService>();
            builder.Services.AddScoped<IAgentCommissionRepository, AgentCommissionRepository>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();

            builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
            builder.Services.AddScoped<IClaimService, ClaimService>();

            builder.Services.AddScoped<IReportRepository, ReportRepository>();
            builder.Services.AddScoped<IReportService, ReportService>();

            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
            builder.Services.AddScoped<INotificationService, NotificationService>();

       
            // JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var jwtSection = builder.Configuration.GetSection("Jwt");
                    var keyString = jwtSection["Key"];
                    if (string.IsNullOrWhiteSpace(keyString))
                        throw new InvalidOperationException("JWT Key is missing in appsettings.json");
                    var key = Encoding.UTF8.GetBytes(keyString);


                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = jwtSection["Issuer"],
                        ValidAudience = jwtSection["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key),

                        RoleClaimType = ClaimTypes.Role,
                        NameClaimType = ClaimTypes.NameIdentifier,

                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:4200")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            var app = builder.Build();

            app.UseMiddleware<Insurance.API.Middleware.ExceptionMiddleware>();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<InsuranceDbContext>();

                // Applies pending migrations automatically (optional but useful in dev)
                await dbContext.Database.MigrateAsync();

                // Seed default roles
                await DbSeeder.SeedRolesAsync(dbContext);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Enable CORS before Authentication/Authorization
            app.UseCors("AllowAngularFrontend");

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.MapControllers();

            await app.RunAsync();
        }
    }
}
