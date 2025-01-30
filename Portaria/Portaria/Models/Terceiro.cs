using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Terceiro : Pessoa
    {
        [Required(ErrorMessage = "O campo Empresa é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Empresa {  get; set; } // Nome da empresa terceirizada.

        [Required(ErrorMessage = "O campo TipoServico é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter entre 50 2 caracteres")]
        public string TipoServico { get; set; } // Tipo de serviço prestado.

        [Required(ErrorMessage = "O campo Responsavel é obrigatório")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O campo deve ter mais do que 2 caracteres")]
        public string Responsavel { get; set; } // Nome do responsável pelo terceiro.

        public Terceiro()
        {
        }

        public Terceiro(int id, string nome, string cpf, string empresa, string tipoServico, string responsavel) : base(id, nome, cpf)
        {
            Empresa = empresa;
            TipoServico = tipoServico;
            Responsavel = responsavel;
        }
    }
}
