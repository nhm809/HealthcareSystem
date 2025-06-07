using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeStatusToIsAnsweredInQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Question");

            migrationBuilder.AddColumn<bool>(
                name: "IsAnswered",
                table: "Question",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAnswered",
                table: "Question");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Question",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }
    }
}
