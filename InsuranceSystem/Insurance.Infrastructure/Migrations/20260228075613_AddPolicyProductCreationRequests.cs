using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Insurance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPolicyProductCreationRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PolicyProductCreationRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InsuranceRequestId = table.Column<int>(type: "int", nullable: false),
                    RequestedByAgentId = table.Column<int>(type: "int", nullable: false),
                    RequestedToAdminId = table.Column<int>(type: "int", nullable: false),
                    RequestedProductSummary = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    RequiredCoverageDetails = table.Column<string>(type: "nvarchar(800)", maxLength: 800, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CreatedPolicyProductId = table.Column<int>(type: "int", nullable: true),
                    RequestedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResolvedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminRemarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyProductCreationRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyProductCreationRequests_InsuranceRequests_InsuranceRequestId",
                        column: x => x.InsuranceRequestId,
                        principalTable: "InsuranceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicyProductCreationRequests_PolicyProducts_CreatedPolicyProductId",
                        column: x => x.CreatedPolicyProductId,
                        principalTable: "PolicyProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicyProductCreationRequests_Users_RequestedByAgentId",
                        column: x => x.RequestedByAgentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicyProductCreationRequests_Users_RequestedToAdminId",
                        column: x => x.RequestedToAdminId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyProductCreationRequests_CreatedPolicyProductId",
                table: "PolicyProductCreationRequests",
                column: "CreatedPolicyProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyProductCreationRequests_InsuranceRequestId",
                table: "PolicyProductCreationRequests",
                column: "InsuranceRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyProductCreationRequests_RequestedByAgentId",
                table: "PolicyProductCreationRequests",
                column: "RequestedByAgentId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyProductCreationRequests_RequestedToAdminId",
                table: "PolicyProductCreationRequests",
                column: "RequestedToAdminId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PolicyProductCreationRequests");
        }
    }
}
