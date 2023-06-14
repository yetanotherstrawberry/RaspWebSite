using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RaspWebSite.Migrations
{
    /// <inheritdoc />
    public partial class Many : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Entries_EntryId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_EntryId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "EntryId",
                table: "Tags");

            migrationBuilder.CreateTable(
                name: "EntryTag",
                columns: table => new
                {
                    EntryId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntryTag", x => new { x.EntryId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_EntryTag_Entries_EntryId",
                        column: x => x.EntryId,
                        principalTable: "Entries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EntryTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EntryTag_TagsId",
                table: "EntryTag",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EntryTag");

            migrationBuilder.AddColumn<int>(
                name: "EntryId",
                table: "Tags",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tags_EntryId",
                table: "Tags",
                column: "EntryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Entries_EntryId",
                table: "Tags",
                column: "EntryId",
                principalTable: "Entries",
                principalColumn: "Id");
        }
    }
}
