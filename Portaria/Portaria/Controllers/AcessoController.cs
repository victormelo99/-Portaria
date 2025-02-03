using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Portaria.Data;
using Portaria.Models;
using System.Linq;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class AcessoController : Controller
    {
        private readonly PortariaDbContext _context;

        public AcessoController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetAcesso()
        {
            try
            {
                var resultado = await _context.Acesso.Include(a => a.Local).Include(a => a.Veiculo).Include(a => a.Pessoa)
                    .Select(a => new
                    {
                        a.Id,
                        a.HoraEntrada,
                        a.HoraSaida,
                        a.Autorizacao,
                        Local = new
                        {
                            a.Local.Nome
                        },
                        Veiculo = new
                        {
                            a.Veiculo.Modelo,
                            a.Veiculo.Placa
                        },
                        Pessoa = new
                        {
                            a.Pessoa.Nome,
                            a.Pessoa.Cpf
                        }
                    })
                    .ToListAsync();

                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar Acessos. Exceção: {e.Message}");
            }
        }


        [HttpPost]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PostAcesso([FromBody] Acesso acesso)
        {
            try
            {

                var pessoaExistente = await _context.Pessoa.FindAsync(acesso.PessoaId);

                if (pessoaExistente == null)
                {
                    return BadRequest("Pessoa não encontrada.");
                }

                var localExistente = await _context.Local.FindAsync(acesso.LocalId);

                if (localExistente == null)
                {
                    return BadRequest("Local não encontrado.");
                }

                Veiculo veiculoExistente = null;

                if (acesso.VeiculoId.HasValue)
                {
                    veiculoExistente = await _context.Veiculo.FindAsync(acesso.VeiculoId);

                    if (veiculoExistente == null)
                    {
                        veiculoExistente = null;
                    }

                }

                acesso.Pessoa = pessoaExistente;
                acesso.Local = localExistente;

                acesso.Veiculo = veiculoExistente;

                var cadastro = await _context.Acesso.AddAsync(acesso);
                var resultado = await _context.SaveChangesAsync();

                Console.WriteLine("Acesso cadastrado com sucesso.");

                return Ok("Acesso cadastrado com sucesso.");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao cadastrar acesso. Exceção: {e.Message}");
            }
        }



        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutAcesso([FromBody] Acesso acesso)
        {
            try
            {
                var atualizar = _context.Update(acesso);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) de acesso  atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) de (dos) acesso (s). Exceção{e.Message}");

            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteAcesso([FromRoute] int id)
        {
            Acesso acesso = await _context.Acesso.FindAsync(id);
            try
            {
                if (acesso != null)
                {
                    var delete = _context.Acesso.Remove(acesso);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Acesso Removido");
                }
                else
                {
                    return NotFound("Acesso não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de excluir o Acesso. Exceção{e.Message}");

            }
        }

        //méthod para buscar Acesso pelo seu id
        [HttpGet("{id}")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarACesso([FromRoute] int id)
        {
            Acesso acesso = await _context.Acesso.FindAsync(id);
            try
            {
                if (acesso != null)
                {
                    return Ok(acesso);
                }
                else
                {
                    return NotFound("Acesso não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o acesso. Exceção: {e.Message}");
            }

        }

        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarAcesso([FromQuery] string valor)
        {
            try
            {
                valor = valor?.ToUpper() ?? ""; // Certifique-se de que a string de pesquisa não seja nula ou vazia

                var lista = _context.Acesso
                    .Include(a => a.Pessoa)
                    .Include(a => a.Local)
                    .Include(a => a.Veiculo)
                    .Where(acesso =>
                        (acesso.Pessoa != null && acesso.Pessoa.Nome != null && acesso.Pessoa.Nome.ToUpper().Contains(valor)) ||
                        (acesso.Pessoa != null && acesso.Pessoa.Cpf != null && acesso.Pessoa.Cpf.Contains(valor)) ||
                        (acesso.Local != null && acesso.Local.Nome != null && acesso.Local.Nome.ToUpper().Contains(valor)) ||
                        (acesso.Veiculo != null && acesso.Veiculo.Modelo != null && acesso.Veiculo.Modelo.ToUpper().Contains(valor)) ||
                        (acesso.Veiculo != null && acesso.Veiculo.Placa != null && acesso.Veiculo.Placa.ToUpper().Contains(valor)) ||
                        (acesso.Autorizacao != null && acesso.Autorizacao.ToUpper().Contains(valor))
                    )
                    .Select(acesso => new
                    {
                        acesso.Id,
                        NomePessoa = acesso.Pessoa != null ? acesso.Pessoa.Nome : "NÃO INFORMADO",
                        CpfPessoa = acesso.Pessoa != null ? acesso.Pessoa.Cpf : "NÃO INFORMADO",
                        NomeLocal = acesso.Local != null ? acesso.Local.Nome : "NÃO INFORMADO",
                        ModeloVeiculo = acesso.Veiculo != null ? acesso.Veiculo.Modelo : "NÃO UTILIZA",
                        PlacaVeiculo = acesso.Veiculo != null ? acesso.Veiculo.Placa : "NÃO UTILIZA",
                        Autorizacao = acesso.Autorizacao ?? "NÃO INFORMADO",
                        acesso.HoraEntrada,
                        acesso.HoraSaida
                    });

                var listaResult = await lista.ToListAsync(); // Fazendo o ToListAsync aqui para evitar carregar dados desnecessários
                return Ok(listaResult);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o acesso. Exceção: {e.Message}");
            }
        }

    }
}
