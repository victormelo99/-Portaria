using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portaria.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(30, ErrorMessage = "O campo não pode ter mais do que 30 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage ="O campo Login é obrigatório")]
        [StringLength(30, ErrorMessage ="O campo não pode ter mais do que 30 caracteres")]
        public string Login { get; set; }

        [Required(ErrorMessage = "O campo Senha é obrigatório")]
        public string Senha { get; set; }

        [Required(ErrorMessage = "O campo Cargo é obrigatório")]
        public string Cargo { get; set; }

        public bool SenhaResetada { get; set; }


        public Usuario()
        {
        }

        public Usuario(int id, string nome, string login, string senha, string cargo, bool senhaResetada)
        {
            Id = id;
            Nome = nome;
            Login = login;
            Senha = senha;
            Cargo = cargo;
            SenhaResetada = senhaResetada;
        }
    }
}
