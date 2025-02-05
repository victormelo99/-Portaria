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
        
        public DateTime? HoraSaida { get; set; }

        [ForeignKey("Local")]
        public int LocalId { get; set; }
        public Local Local { get; set; }

        public string? Autorizacao { get; set; }

        [ForeignKey("Veiculo")]
        public int? VeiculoId { get; set; }
        public Veiculo? Veiculo { get; set; }

        [ForeignKey("Pessoa")]
        public int PessoaId { get; set; }  
        public Pessoa Pessoa { get; set; }
        public Acesso()
        {
        }

        public Acesso(int id, DateTime horaEntrada, DateTime horaSaida, int localId, string autorizacao, int veiculoId, int pessoaId)
        {
            Id = id;
            HoraEntrada = horaEntrada;
            HoraSaida = horaSaida;
            LocalId = localId;
            Autorizacao = autorizacao;
            VeiculoId = veiculoId;
            PessoaId = pessoaId;
        }
    }
}
