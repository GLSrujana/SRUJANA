using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Insurance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPolicyProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PolicyProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventTypeSupported = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaseRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedByAdminID = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyProducts_Users_CreatedByAdminID",
                        column: x => x.CreatedByAdminID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PolicySuggestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InsuranceRequestId = table.Column<int>(type: "int", nullable: false),
                    PolicyProductId = table.Column<int>(type: "int", nullable: false),
                    SuggestedByAgentId = table.Column<int>(type: "int", nullable: false),
                    SuggestionRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSelectedByCustomer = table.Column<bool>(type: "bit", nullable: false),
                    SuggestedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicySuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicySuggestions_InsuranceRequests_InsuranceRequestId",
                        column: x => x.InsuranceRequestId,
                        principalTable: "InsuranceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicySuggestions_PolicyProducts_PolicyProductId",
                        column: x => x.PolicyProductId,
                        principalTable: "PolicyProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicySuggestions_Users_SuggestedByAgentId",
                        column: x => x.SuggestedByAgentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyProducts_CreatedByAdminID",
                table: "PolicyProducts",
                column: "CreatedByAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_PolicySuggestions_InsuranceRequestId",
                table: "PolicySuggestions",
                column: "InsuranceRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicySuggestions_PolicyProductId",
                table: "PolicySuggestions",
                column: "PolicyProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicySuggestions_SuggestedByAgentId",
                table: "PolicySuggestions",
                column: "SuggestedByAgentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PolicySuggestions");

            migrationBuilder.DropTable(
                name: "PolicyProducts");
        }
    }
}
