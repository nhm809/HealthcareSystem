using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeeklyScheduleAndOverrideSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__WorkSched__Consu__31EC6D26",
                table: "WorkSchedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK__WorkSche__C6AC635EDF22BB92",
                table: "WorkSchedule");

            migrationBuilder.RenameTable(
                name: "WorkSchedule",
                newName: "WorkSchedules");

            migrationBuilder.RenameColumn(
                name: "ConsultantID",
                table: "WorkSchedules",
                newName: "ConsultantId");

            migrationBuilder.RenameColumn(
                name: "WorkScheduleID",
                table: "WorkSchedules",
                newName: "WorkScheduleId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkSchedule_ConsultantID",
                table: "WorkSchedules",
                newName: "IX_WorkSchedules_ConsultantId");

            migrationBuilder.AlterColumn<string>(
                name: "ShiftType",
                table: "WorkSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "WorkSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkSchedules",
                table: "WorkSchedules",
                column: "WorkScheduleId");

            migrationBuilder.CreateTable(
                name: "WeeklyOverrideSchedules",
                columns: table => new
                {
                    WeeklyOverrideScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NewStartTime = table.Column<TimeSpan>(type: "TIME", nullable: true),
                    NewEndTime = table.Column<TimeSpan>(type: "TIME", nullable: true),
                    OverrideType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyOverrideSchedules", x => x.WeeklyOverrideScheduleId);
                    table.ForeignKey(
                        name: "FK_WeeklyOverrideSchedules_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeeklySchedules",
                columns: table => new
                {
                    WeeklyScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TIME", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TIME", nullable: false),
                    ShiftType = table.Column<int>(type: "int", nullable: false),
                    OverrideType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklySchedules", x => x.WeeklyScheduleId);
                    table.ForeignKey(
                        name: "FK_WeeklySchedules_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyOverrideSchedules_UserId",
                table: "WeeklyOverrideSchedules",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklySchedules_UserId",
                table: "WeeklySchedules",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkSchedules_User_ConsultantId",
                table: "WorkSchedules",
                column: "ConsultantId",
                principalTable: "User",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkSchedules_User_ConsultantId",
                table: "WorkSchedules");

            migrationBuilder.DropTable(
                name: "WeeklyOverrideSchedules");

            migrationBuilder.DropTable(
                name: "WeeklySchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkSchedules",
                table: "WorkSchedules");

            migrationBuilder.RenameTable(
                name: "WorkSchedules",
                newName: "WorkSchedule");

            migrationBuilder.RenameColumn(
                name: "ConsultantId",
                table: "WorkSchedule",
                newName: "ConsultantID");

            migrationBuilder.RenameColumn(
                name: "WorkScheduleId",
                table: "WorkSchedule",
                newName: "WorkScheduleID");

            migrationBuilder.RenameIndex(
                name: "IX_WorkSchedules_ConsultantId",
                table: "WorkSchedule",
                newName: "IX_WorkSchedule_ConsultantID");

            migrationBuilder.AlterColumn<string>(
                name: "ShiftType",
                table: "WorkSchedule",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "WorkSchedule",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK__WorkSche__C6AC635EDF22BB92",
                table: "WorkSchedule",
                column: "WorkScheduleID");

            migrationBuilder.AddForeignKey(
                name: "FK__WorkSched__Consu__31EC6D26",
                table: "WorkSchedule",
                column: "ConsultantID",
                principalTable: "User",
                principalColumn: "UserID");
        }
    }
}
