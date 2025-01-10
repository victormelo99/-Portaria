using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Visitante : Pessoa
    {

        [StringLength(100, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string MotivoVisita { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string PessoaVisitada { get; set; } // Nome da pessoa que o visitante irá encontrar

        public Visitante(int id, string nome, string motivoVisita, string pessoaVisitada) : base (id,nome)
        {
            MotivoVisita = motivoVisita;
            PessoaVisitada = pessoaVisitada;
        }
    }
}
