using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class fixRouteDistanceId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RouteDistances",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Distance = table.Column<string>(nullable: true),
                    SortOrder = table.Column<int>(nullable: false),
                    RouteId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteDistances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteDistances_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RouteDistances_RouteId",
                table: "RouteDistances",
                column: "RouteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RouteDistances");
        }
    }
}
