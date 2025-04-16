using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreatingDetailsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Details",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    BirthYear = table.Column<byte>(type: "INTEGER", nullable: false),
                    Sex = table.Column<int>(type: "INTEGER", nullable: false),
                    Sexuality = table.Column<int>(type: "INTEGER", nullable: false),
                    SelectedLocation = table.Column<string>(type: "TEXT", nullable: false),
                    KnownAs = table.Column<string>(type: "TEXT", nullable: false),
                    About = table.Column<string>(type: "TEXT", nullable: false),
                    Interests = table.Column<string>(type: "TEXT", nullable: false),
                    VerificationStatus = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Details", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Details_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Details");
        }
    }
}
