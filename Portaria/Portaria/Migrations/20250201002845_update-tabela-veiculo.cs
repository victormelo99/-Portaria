using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    public partial class updatetabelaveiculo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VeiculoId",
                table: "Acesso",
                newName: "veiculoId");

            migrationBuilder.RenameColumn(
                name: "PessoaId",
                table: "Acesso",
                newName: "pessoaId");


            migrationBuilder.CreateIndex(
                name: "IX_Acesso_pessoaId",
                table: "Acesso",
                column: "pessoaId");

            migrationBuilder.CreateIndex(
                name: "IX_Acesso_veiculoId",
                table: "Acesso",
                column: "veiculoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Acesso_Pessoa_pessoaId",
                table: "Acesso",
                column: "pessoaId",
                principalTable: "Pessoa",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Acesso_Veiculo_veiculoId",
                table: "Acesso",
                column: "veiculoId",
                principalTable: "Veiculo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Acesso_Pessoa_pessoaId",
                table: "Acesso");

            migrationBuilder.DropForeignKey(
                name: "FK_Acesso_Veiculo_veiculoId",
                table: "Acesso");

            migrationBuilder.DropIndex(
                name: "IX_Acesso_pessoaId",
                table: "Acesso");

            migrationBuilder.DropIndex(
                name: "IX_Acesso_veiculoId",
                table: "Acesso");

            migrationBuilder.RenameColumn(
                name: "veiculoId",
                table: "Acesso",
                newName: "VeiculoId");

            migrationBuilder.RenameColumn(
                name: "pessoaId",
                table: "Acesso",
                newName: "PessoaId");

            migrationBuilder.AlterColumn<int>(
                name: "VeiculoId",
                table: "Acesso",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}