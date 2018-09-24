using Microsoft.EntityFrameworkCore.Migrations;

namespace CapstoneProject.Migrations
{
    public partial class stravaAccessTokenForUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StravaAccessTokenHashed",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StravaAccessTokenHashed",
                table: "Users");
        }
    }
}
