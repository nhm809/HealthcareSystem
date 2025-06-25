using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class deleteStartTimeAndEndTimeInWeeklyOverrideSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewEndTime",
                table: "WeeklyOverrideSchedules");

            migrationBuilder.DropColumn(
                name: "NewStartTime",
                table: "WeeklyOverrideSchedules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "NewEndTime",
                table: "WeeklyOverrideSchedules",
                type: "TIME",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "NewStartTime",
                table: "WeeklyOverrideSchedules",
                type: "TIME",
                nullable: true);
        }
    }
}
