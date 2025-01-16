using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class UsuarioLogin
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Login é obrigatório")]
        [StringLength(30, ErrorMessage = "O campo não pode ter mais do que 30 caracteres")]
        public string Login { get; set; }

        [Required(ErrorMessage = "O campo Senha é obrigatório")]
        [StringLength(16, MinimumLength = 8, ErrorMessage = "O campo não pode ter mais do que 16 e menos que 8 caracteres")]
        public string Senha { get; set; }
    }
}
