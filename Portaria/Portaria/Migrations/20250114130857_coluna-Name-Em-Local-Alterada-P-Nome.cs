using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class colunaNameEmLocalAlteradaPNome : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Local",
                newName: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Local",
                newName: "Name");
        }
    }
}
