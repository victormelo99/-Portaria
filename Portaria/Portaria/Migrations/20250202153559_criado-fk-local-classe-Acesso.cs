using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class criadofklocalclasseAcesso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Acesso_LocalId",
                table: "Acesso",
                column: "LocalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Acesso_Local_LocalId",
                table: "Acesso",
                column: "LocalId",
                principalTable: "Local",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Acesso_Local_LocalId",
                table: "Acesso");

            migrationBuilder.DropIndex(
                name: "IX_Acesso_LocalId",
                table: "Acesso");
        }
    }
}
