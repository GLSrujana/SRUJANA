using Insurance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Data
{
    public class InsuranceDbContext : DbContext
    {
        public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options)
            : base(options)
        {
        }

        // Tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<InsuranceRequest> InsuranceRequests { get; set; } = null!;
        public DbSet<RequestEventDetail> RequestEventDetails { get; set; } = null!;
        public DbSet<AgentAssignment> AgentAssignments { get; set; } = null!;
        public DbSet<PolicyProduct> PolicyProducts { get; set; } = null!;
        public DbSet<PolicySuggestion> PolicySuggestions { get; set; } = null!;
        public DbSet<PolicyProductCreationRequest> PolicyProductCreationRequests { get; set; } = null!;
        public DbSet<PolicyApplication> PolicyApplications { get; set; } = null!;
        public DbSet<ApplicationDocument> ApplicationDocuments { get; set; } = null!;
        public DbSet<ActivePolicy> ActivePolicies { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<AgentCommission> AgentCommissions { get; set; } = null!;
        public DbSet<Claim> Claims { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // =========================
            // Role configuration
            // =========================
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");

                entity.Property(r => r.Name)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(r => r.Description)
                      .HasMaxLength(200);

                entity.HasIndex(r => r.Name)
                      .IsUnique();
            });

            // =========================
            // User configuration
            // =========================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.Property(u => u.FullName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.PhoneNumber)
                      .HasMaxLength(20);

                entity.HasIndex(u => u.Email)
                      .IsUnique();

                entity.HasOne(u => u.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // InsuranceRequest configuration
            // =========================
            modelBuilder.Entity<InsuranceRequest>(entity =>
            {
                entity.ToTable("InsuranceRequests");

                entity.Property(r => r.RequestedCoverageAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(r => r.PreferredCoverageNotes)
                      .HasMaxLength(500);

                entity.Property(r => r.AdminRemarks)
                      .HasMaxLength(500);

                entity.HasOne(r => r.Customer)
                      .WithMany(u => u.CustomerInsuranceRequests)
                      .HasForeignKey(r => r.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.AssignedAgent)
                      .WithMany(u => u.AssignedInsuranceRequests)
                      .HasForeignKey(r => r.AssignedAgentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // RequestEventDetail configuration
            // =========================
            modelBuilder.Entity<RequestEventDetail>(entity =>
            {
                entity.ToTable("RequestEventDetails");

                entity.Property(d => d.EventType)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(d => d.Location)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(d => d.EventBudget)
                      .HasColumnType("decimal(18,2)");

                entity.Property(d => d.SpecialNotes)
                      .HasMaxLength(500);

                entity.HasOne(d => d.InsuranceRequest)
                      .WithOne(r => r.RequestEventDetail)
                      .HasForeignKey<RequestEventDetail>(d => d.InsuranceRequestId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // =========================
            // AgentAssignment configuration
            // =========================
            modelBuilder.Entity<AgentAssignment>(entity =>
            {
                entity.ToTable("AgentAssignments");

                entity.HasOne(a => a.InsuranceRequest)
                      .WithMany()
                      .HasForeignKey(a => a.InsuranceRequestId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Agent)
                      .WithMany(u => u.AgentAssignments)
                      .HasForeignKey(a => a.AgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.AssignedByAdmin)
                      .WithMany(u => u.AdminAssignedRequests)
                      .HasForeignKey(a => a.AssignedByAdminId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // PolicyProduct configuration (minimal explicit mapping)
            // =========================
            modelBuilder.Entity<PolicyProduct>(entity =>
            {
                entity.ToTable("PolicyProducts");

                entity.Property(p => p.MinCoverageAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.MaxCoverageAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.BaseRate)
                      .HasColumnType("decimal(18,2)");

                entity.HasOne(p => p.CreatedByAdmin)
                      .WithMany()
                      .HasForeignKey(p => p.CreatedByAdminID) // or CreatedByAdminId
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =========================
            // PolicySuggestion configuration (minimal explicit mapping)
            // =========================
            modelBuilder.Entity<PolicySuggestion>(entity =>
            {
                entity.ToTable("PolicySuggestions");

                entity.HasOne(s => s.InsuranceRequest)
                      .WithMany()
                      .HasForeignKey(s => s.InsuranceRequestId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.PolicyProduct)
                      .WithMany()
                      .HasForeignKey(s => s.PolicyProductId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.SuggestedByAgent)
                      .WithMany()
                      .HasForeignKey(s => s.SuggestedByAgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(s => s.PremiumMonthly)
                      .HasColumnType("decimal(18,2)");

                entity.Property(s => s.Premium6Months)
                      .HasColumnType("decimal(18,2)");

                entity.Property(s => s.PremiumYearly)
                      .HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<PolicyProductCreationRequest>(entity =>
            {
                entity.ToTable("PolicyProductCreationRequests");

                entity.Property(x => x.RequestedProductSummary)
                      .IsRequired()
                      .HasMaxLength(300);

                entity.Property(x => x.RequiredCoverageDetails)
                      .HasMaxLength(800);

                //entity.Property(x => x.Status)
                //      .IsRequired()
                //      .HasMaxLength(30);

                entity.Property(x => x.AdminRemarks)
                      .HasMaxLength(500);

                entity.HasOne(x => x.InsuranceRequest)
                      .WithMany()
                      .HasForeignKey(x => x.InsuranceRequestId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.RequestedByAgent)
                      .WithMany()
                      .HasForeignKey(x => x.RequestedByAgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.RequestedToAdmin)
                      .WithMany()
                      .HasForeignKey(x => x.RequestedToAdminId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.CreatedPolicyProduct)
                      .WithMany()
                      .HasForeignKey(x => x.CreatedPolicyProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PolicyApplication>(entity =>
            {
                entity.ToTable("PolicyApplications");

                entity.Property(p => p.CoverageAmount).HasColumnType("decimal(18,2)");
                entity.Property(p => p.CalculatedPremium).HasColumnType("decimal(18,2)");
                entity.Property(p => p.PremiumAmountPerPayment).HasColumnType("decimal(18,2)");
                entity.Property(p => p.PaymentOption).HasMaxLength(30);

                entity.HasOne(p => p.InsuranceRequest)
                      .WithMany()
                      .HasForeignKey(p => p.InsuranceRequestId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Customer)
                      .WithMany()
                      .HasForeignKey(p => p.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Agent)
                      .WithMany()
                      .HasForeignKey(p => p.AgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.PolicyProduct)
                      .WithMany()
                      .HasForeignKey(p => p.PolicyProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ApplicationDocument>(entity =>
            {
                entity.ToTable("ApplicationDocuments");

                entity.Property(d => d.DocumentType).IsRequired().HasMaxLength(50);
                entity.Property(d => d.FileName).IsRequired().HasMaxLength(200);
                entity.Property(d => d.FilePath).IsRequired().HasMaxLength(500);

                entity.HasOne(d => d.PolicyApplication)
                      .WithMany()
                      .HasForeignKey(d => d.PolicyApplicationId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.UploadedByUser)
                      .WithMany()
                      .HasForeignKey(d => d.UploadedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ActivePolicy>(entity =>
            {
                entity.ToTable("ActivePolicies");

                entity.Property(p => p.PolicyNumber).IsRequired().HasMaxLength(30);
                entity.HasIndex(p => p.PolicyNumber).IsUnique();

                entity.Property(p => p.TotalPremium).HasColumnType("decimal(18,2)");
                entity.Property(p => p.PremiumAmountPerPayment).HasColumnType("decimal(18,2)");
                entity.Property(p => p.PaymentOption).HasMaxLength(30);

                entity.HasOne(p => p.PolicyApplication)
                      .WithMany()
                      .HasForeignKey(p => p.PolicyApplicationId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Customer)
                      .WithMany()
                      .HasForeignKey(p => p.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Agent)
                      .WithMany()
                      .HasForeignKey(p => p.AgentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("Payments");
                entity.Property(p => p.Amount).HasColumnType("decimal(18,2)");

                entity.HasOne(p => p.ActivePolicy)
                      .WithMany(ap => ap.Payments)
                      .HasForeignKey(p => p.ActivePolicyId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AgentCommission>(entity =>
            {
                entity.ToTable("AgentCommissions");
                entity.Property(x => x.CommissionRate).HasColumnType("decimal(18,4)");
                entity.Property(x => x.CommissionAmount).HasColumnType("decimal(18,2)");

                entity.HasOne(x => x.Agent).WithMany()
                      .HasForeignKey(x => x.AgentId).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.ActivePolicy).WithMany()
                      .HasForeignKey(x => x.ActivePolicyId).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Payment).WithMany()
                      .HasForeignKey(x => x.PaymentId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Claim>(entity =>
            {
                entity.ToTable("Claims");

                entity.Property(c => c.ClaimReason).IsRequired().HasMaxLength(500);
                entity.Property(c => c.ClaimAmountRequested).HasColumnType("decimal(18,2)");
                entity.Property(c => c.ApprovedSettlementAmount).HasColumnType("decimal(18,2)");
                entity.Property(c => c.OfficerRemarks).HasMaxLength(500);

                entity.HasOne(c => c.ActivePolicy)
                      .WithMany(ap => ap.Claims)
                      .HasForeignKey(c => c.ActivePolicyId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Customer)
                      .WithMany()
                      .HasForeignKey(c => c.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.ReviewedByClaimsOfficer)
                      .WithMany()
                      .HasForeignKey(c => c.ReviewedByClaimsOfficerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notifications");
                entity.Property(n => n.Title).IsRequired().HasMaxLength(150);
                entity.Property(n => n.Message).IsRequired().HasMaxLength(500);

                entity.HasOne(n => n.User)
                      .WithMany()
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}