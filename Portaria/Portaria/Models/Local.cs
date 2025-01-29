using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Local
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Nome { get; set; }

        public string Descricao { get; set; }

        public Local()
        {
        }


        public Local(int id, string nome, string descricao)
        {
            Id = id;
            Nome = nome;
            Descricao = descricao;
        }
    }
}
