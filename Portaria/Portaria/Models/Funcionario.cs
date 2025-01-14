using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Funcionario : Pessoa
    {
        public int Matricula { get; set; }

        [Required(ErrorMessage = "O campo DataAdmissao é obrigatório")]
        public DateTime DataAdmissao { get; set; }

        public DateTime DataDesligamento { get; set; }

        public Status Status { get; set; }
        
        [Required(ErrorMessage = "O campo Cargo é obrigatório")]
        public string Cargo { get; set; }

        public Funcionario(int id, string nome, int matricula, DateTime dataAdmissao, DateTime dataDesligamento, string cargo) : base (id, nome)
        {
            Matricula = matricula;
            DataAdmissao = dataAdmissao;
            DataDesligamento = dataDesligamento;
            Cargo = cargo;
        }
    }
}
