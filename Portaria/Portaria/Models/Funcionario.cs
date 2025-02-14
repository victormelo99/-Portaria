using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Funcionario : Pessoa
    {
        [Required (ErrorMessage = "o campo matricula é obrigatório")]
        public int Matricula { get; set; }

        [Required(ErrorMessage = "O campo DataAdmissao é obrigatório")]
        public DateTime DataAdmissao { get; set; }

        public DateTime? DataDesligamento { get; set; }

        [Required(ErrorMessage = "O campo status é obrigatório")]
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
