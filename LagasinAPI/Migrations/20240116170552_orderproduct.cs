using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LagasinAPI.Migrations
{
    public partial class orderproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "OrderProduct",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "OrderProduct",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "OrderProduct");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "OrderProduct");
        }
    }
}
