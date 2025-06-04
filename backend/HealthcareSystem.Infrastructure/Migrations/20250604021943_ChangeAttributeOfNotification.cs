using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAttributeOfNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Notification");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Notification",
                newName: "Title");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Notification",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Notification");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Notification",
                newName: "Type");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Notification",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }
    }
}
