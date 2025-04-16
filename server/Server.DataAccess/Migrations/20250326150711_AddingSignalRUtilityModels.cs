using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddingSignalRUtilityModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Identifier = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Identifier);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionId = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    GroupIdentifier = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionId);
                    table.ForeignKey(
                        name: "FK_Connections_Groups_GroupIdentifier",
                        column: x => x.GroupIdentifier,
                        principalTable: "Groups",
                        principalColumn: "Identifier");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_GroupIdentifier",
                table: "Connections",
                column: "GroupIdentifier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Groups");
        }
    }
}
