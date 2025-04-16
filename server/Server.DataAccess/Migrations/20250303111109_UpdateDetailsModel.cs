using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDetailsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sex",
                table: "Details",
                newName: "LocationNormalized");

            migrationBuilder.RenameColumn(
                name: "SelectedLocation",
                table: "Details",
                newName: "Gender");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Details",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longtitude",
                table: "Details",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Details");

            migrationBuilder.DropColumn(
                name: "Longtitude",
                table: "Details");

            migrationBuilder.RenameColumn(
                name: "LocationNormalized",
                table: "Details",
                newName: "Sex");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Details",
                newName: "SelectedLocation");
        }
    }
}
