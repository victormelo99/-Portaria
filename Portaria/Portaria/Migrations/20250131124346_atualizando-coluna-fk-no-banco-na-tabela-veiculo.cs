using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class atualizandocolunafknobanconatabelaveiculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "VeiculoId",
                table: "Acesso",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Veiculo_PessoaId",
                table: "Veiculo",
                column: "PessoaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Veiculo_Pessoa_PessoaId",
                table: "Veiculo",
                column: "PessoaId",
                principalTable: "Pessoa",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculo_Pessoa_PessoaId",
                table: "Veiculo");

            migrationBuilder.DropIndex(
                name: "IX_Veiculo_PessoaId",
                table: "Veiculo");

            migrationBuilder.AlterColumn<int>(
                name: "VeiculoId",
                table: "Acesso",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
