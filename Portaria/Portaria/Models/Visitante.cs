using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Visitante : Pessoa
    {

        [StringLength(100, ErrorMessage = "O campo deve ter até 100 caracteres")]
        public string MotivoVisita { get; set; }

        [StringLength(50, ErrorMessage = "O campo deve ter até 50caracteres")]
        public string PessoaVisitada { get; set; } // Nome da pessoa que o visitante irá encontrar

        public Visitante()
        {
        }

        public Visitante(int id, string nome, string cpf, string motivoVisita, string pessoaVisitada) : base (id,nome, cpf)
        {
            MotivoVisita = motivoVisita;
            PessoaVisitada = pessoaVisitada;
        }
    }
}
