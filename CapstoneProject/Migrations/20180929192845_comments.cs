using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class comments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PathComments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Note = table.Column<string>(nullable: true),
                    Latitude1 = table.Column<string>(nullable: true),
                    Longitude1 = table.Column<string>(nullable: true),
                    Latitude2 = table.Column<string>(nullable: true),
                    Longitude2 = table.Column<string>(nullable: true),
                    Writer = table.Column<string>(nullable: true),
                    RouteId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PathComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PathComments_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PathComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "PointComments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Note = table.Column<string>(nullable: true),
                    Latitude = table.Column<string>(nullable: true),
                    Longitude = table.Column<string>(nullable: true),
                    Writer = table.Column<string>(nullable: true),
                    RouteId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PointComments_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PointComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PathComments_RouteId",
                table: "PathComments",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_PathComments_UserId",
                table: "PathComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PointComments_RouteId",
                table: "PointComments",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_PointComments_UserId",
                table: "PointComments",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PathComments");

            migrationBuilder.DropTable(
                name: "PointComments");
        }
    }
}
