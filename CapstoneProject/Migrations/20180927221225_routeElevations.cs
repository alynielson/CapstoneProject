using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class routeElevations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RouteElevations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Up = table.Column<string>(nullable: true),
                    Down = table.Column<string>(nullable: true),
                    SortOrder = table.Column<string>(nullable: true),
                    RouteId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteElevations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteElevations_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RouteElevations_RouteId",
                table: "RouteElevations",
                column: "RouteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RouteElevations");
        }
    }
}
