using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class addLAtlngToEvent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LatitudeStart",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LongitudeStart",
                table: "Events",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatitudeStart",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LongitudeStart",
                table: "Events");
        }
    }
}
