using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portaria.Models
{
    public class Veiculo
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Placa é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Placa { get; set; }

        [Required(ErrorMessage = "O campo modelo é obrigatório")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Modelo { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Cor { get; set; }

        public TipoVeiculo TipoVeiculo { get; set; }

        [ForeignKey("Pessoa")]
        public int PessoaId { get; set; }
        public Veiculo()
        {
        }

        public Veiculo(int id, string placa, string modelo, string cor, TipoVeiculo tipoVeiculo, int pessoaId)
        {
            Id = id;
            Placa = placa;
            Modelo = modelo;
            Cor = cor;
            TipoVeiculo = tipoVeiculo;
            PessoaId = pessoaId;
        }
    }
}
