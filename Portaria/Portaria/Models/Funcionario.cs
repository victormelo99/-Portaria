using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Funcionario : Pessoa
    {
        [Range(1, 99999999999999, ErrorMessage = "O campo deve estar entre 1 e 14 dígitos")]
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
