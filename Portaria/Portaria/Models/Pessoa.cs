using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Pessoa
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Nome { get; set; }

        public Pessoa()
        {
        }

        public Pessoa(int id, string nome)
        {
            Id = id;
            Nome = nome;
        }
    }
}
