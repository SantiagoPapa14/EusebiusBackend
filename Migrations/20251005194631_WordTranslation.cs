using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EusebiusBackend.Migrations
{
    /// <inheritdoc />
    public partial class WordTranslation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Translation",
                table: "Words",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translation",
                table: "Words");
        }
    }
}
