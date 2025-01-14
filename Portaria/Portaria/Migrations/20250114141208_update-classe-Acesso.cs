using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class updateclasseAcesso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Acesso_Pessoa_PessoaId",
                table: "Acesso");

            migrationBuilder.DropForeignKey(
                name: "FK_Acesso_Veiculo_VeiculoId",
                table: "Acesso");

            migrationBuilder.DropIndex(
                name: "IX_Acesso_PessoaId",
                table: "Acesso");

            migrationBuilder.DropIndex(
                name: "IX_Acesso_VeiculoId",
                table: "Acesso");

            migrationBuilder.RenameColumn(
                name: "Local",
                table: "Acesso",
                newName: "LocalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LocalId",
                table: "Acesso",
                newName: "Local");

            migrationBuilder.CreateIndex(
                name: "IX_Acesso_PessoaId",
                table: "Acesso",
                column: "PessoaId");

            migrationBuilder.CreateIndex(
                name: "IX_Acesso_VeiculoId",
                table: "Acesso",
                column: "VeiculoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Acesso_Pessoa_PessoaId",
                table: "Acesso",
                column: "PessoaId",
                principalTable: "Pessoa",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Acesso_Veiculo_VeiculoId",
                table: "Acesso",
                column: "VeiculoId",
                principalTable: "Veiculo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
