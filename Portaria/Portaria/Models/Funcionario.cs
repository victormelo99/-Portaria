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

        public Funcionario()
        {
        }

        public Funcionario(int id, string nome, string cpf, int matricula, DateTime dataAdmissao, DateTime dataDesligamento) : base (id, nome,cpf)
        {
            Matricula = matricula;
            DataAdmissao = dataAdmissao;
            DataDesligamento = dataDesligamento;
        }
    }
}
