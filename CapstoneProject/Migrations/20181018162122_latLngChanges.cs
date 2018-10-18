using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class latLngChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "PointComments",
                newName: "Longitude1");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "PointComments",
                newName: "Latitude1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude1",
                table: "PointComments",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude1",
                table: "PointComments",
                newName: "Latitude");
        }
    }
}
