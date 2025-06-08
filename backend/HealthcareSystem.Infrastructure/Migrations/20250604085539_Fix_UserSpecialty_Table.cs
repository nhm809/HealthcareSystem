using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Fix_UserSpecialty_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__UserSpeci__Speci__4F7CD00D",
                table: "UserSpecialty");

            migrationBuilder.DropForeignKey(
                name: "FK__UserSpeci__UserI__4E88ABD4",
                table: "UserSpecialty");

            migrationBuilder.DropPrimaryKey(
                name: "PK__UserSpec__8AFE43C8943BFACE",
                table: "UserSpecialty");

            migrationBuilder.RenameColumn(
                name: "SpecialtyID",
                table: "UserSpecialty",
                newName: "SpecialtyId");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "UserSpecialty",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserSpecialty_SpecialtyID",
                table: "UserSpecialty",
                newName: "IX_UserSpecialty_SpecialtyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSpecialty",
                table: "UserSpecialty",
                columns: new[] { "UserId", "SpecialtyId" });

            //migrationBuilder.CreateTable(
            //    name: "SpecialtyUser",
            //    columns: table => new
            //    {
            //        SpecialtiesSpecialtyId = table.Column<int>(type: "int", nullable: false),
            //        UsersUserId = table.Column<int>(type: "int", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_SpecialtyUser", x => new { x.SpecialtiesSpecialtyId, x.UsersUserId });
            //        table.ForeignKey(
            //            name: "FK_SpecialtyUser_Specialty_SpecialtiesSpecialtyId",
            //            column: x => x.SpecialtiesSpecialtyId,
            //            principalTable: "Specialty",
            //            principalColumn: "SpecialtyID",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_SpecialtyUser_User_UsersUserId",
            //            column: x => x.UsersUserId,
            //            principalTable: "User",
            //            principalColumn: "UserID",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            migrationBuilder.CreateIndex(
                name: "IX_SpecialtyUser_UsersUserId",
                table: "SpecialtyUser",
                column: "UsersUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSpecialty_Specialty_SpecialtyId",
                table: "UserSpecialty",
                column: "SpecialtyId",
                principalTable: "Specialty",
                principalColumn: "SpecialtyID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSpecialty_User_UserId",
                table: "UserSpecialty",
                column: "UserId",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserSpecialty_Specialty_SpecialtyId",
                table: "UserSpecialty");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSpecialty_User_UserId",
                table: "UserSpecialty");

            migrationBuilder.DropTable(
                name: "SpecialtyUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSpecialty",
                table: "UserSpecialty");

            migrationBuilder.RenameColumn(
                name: "SpecialtyId",
                table: "UserSpecialty",
                newName: "SpecialtyID");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserSpecialty",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_UserSpecialty_SpecialtyId",
                table: "UserSpecialty",
                newName: "IX_UserSpecialty_SpecialtyID");

            migrationBuilder.AddPrimaryKey(
                name: "PK__UserSpec__8AFE43C8943BFACE",
                table: "UserSpecialty",
                columns: new[] { "UserID", "SpecialtyID" });

            migrationBuilder.AddForeignKey(
                name: "FK__UserSpeci__Speci__4F7CD00D",
                table: "UserSpecialty",
                column: "SpecialtyID",
                principalTable: "Specialty",
                principalColumn: "SpecialtyID");

            migrationBuilder.AddForeignKey(
                name: "FK__UserSpeci__UserI__4E88ABD4",
                table: "UserSpecialty",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID");
        }
    }
}
