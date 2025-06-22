using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IsAvailableColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "User");
        }
    }
}
