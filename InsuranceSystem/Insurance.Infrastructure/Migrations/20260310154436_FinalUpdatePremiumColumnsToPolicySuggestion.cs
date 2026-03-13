using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Insurance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalUpdatePremiumColumnsToPolicySuggestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Premium6Months",
                table: "PolicySuggestions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PremiumMonthly",
                table: "PolicySuggestions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PremiumYearly",
                table: "PolicySuggestions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Premium6Months",
                table: "PolicySuggestions");

            migrationBuilder.DropColumn(
                name: "PremiumMonthly",
                table: "PolicySuggestions");

            migrationBuilder.DropColumn(
                name: "PremiumYearly",
                table: "PolicySuggestions");
        }
    }
}
