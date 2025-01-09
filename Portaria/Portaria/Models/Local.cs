using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Local
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Name { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Descricao { get; set; }

        public Local()
        {
        }

        public Local(int id, string name, string descricao)
        {
            Id = id;
            Name = name;
            Descricao = descricao;
        }
    }
}
