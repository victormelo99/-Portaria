using System.ComponentModel.DataAnnotations;

namespace Portaria.Models
{
    public class Cadastro
    {
        [Key]
        public int Id { get; set; }
        
        [Required (ErrorMessage ="O campo matricula é obrigatório")]
        public int Matricula {  get; set; }
        
        [Required (ErrorMessage ="O campo tipo é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo deve ter no máximo 50 caracteres")]
        public string Tipo { get; set; }

        [Required (ErrorMessage ="o campo situação é obrigatório")]
        [StringLength(5, ErrorMessage = "O campo deve ter no máximo 5 caracteres")]
        public string Situacao { get; set; }

        [Required (ErrorMessage = "o campo nome é obrigatório")]
        [StringLength (50, ErrorMessage = "O campo deve ter no máximo 50 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "o campo identidade é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo deve ter no máximo 50 caracteres")]
        public string Identidade { get; set; }

        [Required(ErrorMessage = "o campo identidade é obrigatório")]
        [StringLength(20, ErrorMessage = "O campo deve ter no máximo 20 caracteres")]
        public string Placa { get; set; }

        [Required(ErrorMessage = "o campo veículo é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo deve ter no máximo 50 caracteres")]
        public string Veiculo { get; set; }

        [Required(ErrorMessage = "o campo cidade é obrigatório")]
        [StringLength(50, ErrorMessage = " campo deve ter no máximo 50 caracteres")]
        public string Cidade { get; set; }

        [Required(ErrorMessage = "o campo UF é obrigatório")]
        [StringLength(2, ErrorMessage = "O campo deve ter no máximo 2 caracteres")]
        public string Uf { get; set; }

        [Required(ErrorMessage = "o campo empresa é obrigatório")]
        [StringLength(30, ErrorMessage = "O campo deve ter no máximo 30 caracteres")]
        public string Empresa { get; set; }

        [Required(ErrorMessage = "O campo DataCadastro é obrigatório")]
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        public Cadastro()
        {
        }

        public Cadastro(int id, int matricula, string tipo, string situacao, string nome, string identidade, string placa, string veiculo, 
            string cidade, string uf, string empresa)
        {
            Id = id;
            Matricula = matricula;
            Tipo = tipo;
            Situacao = situacao;
            Nome = nome;
            Identidade = identidade;
            Placa = placa;
            Veiculo = veiculo;
            Cidade = cidade;
            Uf = uf;
            Empresa = empresa;
        }
    }
}
