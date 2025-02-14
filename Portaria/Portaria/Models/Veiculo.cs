using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portaria.Models
{
    public class Veiculo
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Placa é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter entre 2 e 50 caracteres")]
        public string Placa { get; set; }

        [Required(ErrorMessage = "O campo modelo é obrigatório")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "O campo deve ter entre 2 e 30 caracteres")]
        public string Modelo { get; set; }

        [Required(ErrorMessage = "O campo cor é obrigatório")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "O campo deve ter entre 2 e 20 caracteres")]
        public string Cor { get; set; }

        public TipoVeiculo TipoVeiculo { get; set; }

        [ForeignKey("Pessoa")]
        public int PessoaId { get; set; }
        public Pessoa pessoa { get; set; }
        public DateTime DataRegistro { get; set; }


        public Veiculo()
        {
        }

        public Veiculo(int id, string placa, string modelo, string cor, TipoVeiculo tipoVeiculo,DateTime dataRegistro, int pessoaId)
        {
            Id = id;
            Placa = placa;
            Modelo = modelo;
            Cor = cor;
            TipoVeiculo = tipoVeiculo;
            PessoaId = pessoaId;
            DataRegistro = dataRegistro;
        }
    }
}
