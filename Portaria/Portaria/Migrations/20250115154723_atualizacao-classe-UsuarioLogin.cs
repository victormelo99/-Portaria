using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portaria.Migrations
{
    /// <inheritdoc />
    public partial class atualizacaoclasseUsuarioLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PessoaId",
                table: "UsuarioLogin");

            migrationBuilder.DropColumn(
                name: "Cargo",
                table: "Funcionario");

            migrationBuilder.RenameColumn(
                name: "NomeUsuario",
                table: "UsuarioLogin",
                newName: "Cargo");

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "UsuarioLogin",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Login",
                table: "UsuarioLogin",
                type: "varchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Nome",
                table: "UsuarioLogin",
                type: "varchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Login",
                table: "UsuarioLogin");

            migrationBuilder.DropColumn(
                name: "Nome",
                table: "UsuarioLogin");

            migrationBuilder.RenameColumn(
                name: "Cargo",
                table: "UsuarioLogin",
                newName: "NomeUsuario");

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "UsuarioLogin",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "PessoaId",
                table: "UsuarioLogin",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Cargo",
                table: "Funcionario",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
