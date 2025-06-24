using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateWeeklySchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverrideType",
                table: "WeeklySchedules");

            migrationBuilder.RenameColumn(
                name: "Reason",
                table: "WeeklySchedules",
                newName: "Note");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Note",
                table: "WeeklySchedules",
                newName: "Reason");

            migrationBuilder.AddColumn<string>(
                name: "OverrideType",
                table: "WeeklySchedules",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
