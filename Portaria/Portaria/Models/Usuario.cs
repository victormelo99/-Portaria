using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo deve ter no máximo 50 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo email é obrigatório")]
        [StringLength(70, ErrorMessage = "O campo deve ter no máximo 70 caracteres")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O campo senha é obrigatório")]
        [StringLength(16, MinimumLength = 8 , ErrorMessage = "O campo senha deve ter entre 8 e 16 caracteres")]
        public string Senha { get; set; }

        [Required(ErrorMessage ="O campo situaçãoId é obrigatório")]
        public SituacaoUsuario SituacaoId { get; set; }

        [Required (ErrorMessage ="O campo nívelAcessoId é obrigatório")]
        [StringLength (2, ErrorMessage ="O campo deve ter no máximo 2 caracteres")]
        public int NivelAcessoId { get; set; }

        [Required (ErrorMessage ="O campo Created é obrigatório")]
        public DateTime Created {  get; set; } = DateTime.Now;

        [Required(ErrorMessage = "O campo Modified é obrigatório")]
        public DateTime Modified { get; set; } = DateTime.Now;

        public Usuario()
        {
        }

        public Usuario(int id, string nome, string email, string senha, int nivelAcessoId, DateTime created, DateTime modified)
        {
            Id = id;
            Nome = nome;
            Email = email;
            Senha = senha;
            NivelAcessoId = nivelAcessoId;
            Created = created;
            Modified = modified;
        }
    }
}
