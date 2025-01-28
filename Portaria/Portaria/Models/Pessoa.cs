using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Pessoa
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deveter entre 2 e 50 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo CPF é obrigatório")]
        [StringLength(11, MinimumLength = 2, ErrorMessage = "O campo deve ter entre 2 e 11 caracteres")]
        public string Cpf { get; set; }

        public Pessoa()
        {
        }

        public Pessoa(int id, string nome, string cpf)
        {
            Id = id;
            Nome = nome;
            Cpf = cpf;
        }
    }
}
