using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class insercaocolunacargofuncionario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Veiculo_Pessoa_PessoaId",
                table: "Veiculo");

            migrationBuilder.DropIndex(
                name: "IX_Veiculo_PessoaId",
                table: "Veiculo");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Local",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Cargo",
                table: "Funcionario",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cargo",
                table: "Funcionario");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Local",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

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
    }
}
