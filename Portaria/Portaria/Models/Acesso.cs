using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portaria.Models
{
    public class Acesso
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage ="O campo hora de entrada é obrigatório")]
        public DateTime HoraEntrada { get; set; }
        
        public DateTime HoraSaida { get; set; }

        [ForeignKey("Local")]
        public int LocalId { get; set; } // Local de acesso.

        public string? Autorizacao { get; set; } // Pessoa que autorizou o acesso.

        [ForeignKey("Veiculo")]
        public int veiculoId { get; set; }
        public Veiculo Veiculo { get; set; }

        [ForeignKey("Pessoa")]
        public int pessoaId { get; set; }  
        public Pessoa pessoa { get; set; }
        public Acesso()
        {
        }

        public Acesso(int id, DateTime horaEntrada, DateTime horaSaida, int localId, string autorizacao, int VeiculoId, int PessoaId)
        {
            Id = id;
            HoraEntrada = horaEntrada;
            HoraSaida = horaSaida;
            LocalId = localId;
            Autorizacao = autorizacao;
            veiculoId = VeiculoId;
            PessoaId = PessoaId;
        }
    }
}
