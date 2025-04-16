using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingDetailsBirthYearType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
            name: "BirthYear",
            table: "Details",
            nullable: false,
            oldClrType: typeof(byte),
            oldNullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte>(
            name: "BirthYear",
            table: "Details",
            nullable: false,
            oldClrType: typeof(int),
            oldNullable: false);
        }
    }
}
