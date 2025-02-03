using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Portaria.Data;
using Portaria.Models;

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
                Console.WriteLine($"Dados recebidos: {JsonConvert.SerializeObject(acesso)}");

                if (acesso == null)
                {
                    return BadRequest("Dados de acesso não fornecidos.");
                }

                var pessoaExistente = await _context.Pessoa.FindAsync(acesso.PessoaId);

                if (pessoaExistente == null)
                {
                    Console.WriteLine("Pessoa não encontrada.");
                    return BadRequest("Pessoa não encontrada.");
                }

                var localExistente = await _context.Local.FindAsync(acesso.LocalId);

                if (localExistente == null)
                {
                    Console.WriteLine("Local não encontrado.");
                    return BadRequest("Local não encontrado.");
                }

                Veiculo veiculoExistente = null;

                if (acesso.veiculoId.HasValue)
                {
                    veiculoExistente = await _context.Veiculo.FindAsync(acesso.veiculoId);
                    if (veiculoExistente == null)
                    {
                        Console.WriteLine("Veículo não encontrado.");
                        veiculoExistente = null;  // Aqui definimos o veículo como null se não for encontrado
                    }
                }

                acesso.Pessoa = pessoaExistente;
                acesso.Local = localExistente;

                // Se o veículo foi encontrado, atribuímos ele ao acesso. Caso contrário, o campo ficará null
                acesso.Veiculo = veiculoExistente;

                var cadastro = await _context.Acesso.AddAsync(acesso);
                var resultado = await _context.SaveChangesAsync();

                Console.WriteLine("Acesso cadastrado com sucesso.");

                return Ok("Acesso cadastrado com sucesso.");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erro ao cadastrar acesso. Exceção: {e.Message}");
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
    }
}
