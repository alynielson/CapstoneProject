using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class latLngCoordinatesForRoute : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "RouteCoordinates",
                newName: "Longitude1");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "RouteCoordinates",
                newName: "Latitude1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude1",
                table: "RouteCoordinates",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude1",
                table: "RouteCoordinates",
                newName: "Latitude");
        }
    }
}
