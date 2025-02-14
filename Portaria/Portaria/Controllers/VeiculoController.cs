using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portaria.Data;
using Portaria.Models;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VeiculoController : Controller
    {
        private readonly PortariaDbContext _context;

        public VeiculoController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetVeiculos()
        {
            try
            {
                var resultado = await _context.Veiculo.Include(p => p.pessoa).ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar os veículos. Exceção{e.Message}");

            }
        }
        [HttpPost]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PostVeiculo([FromBody] Veiculo veiculo)
        {
            try
            {
                var pessoaExistente = await _context.Pessoa.FindAsync(veiculo.PessoaId);
                if (pessoaExistente == null)
                {
                    return BadRequest("Pessoa não encontrada.");
                } 

                _context.Pessoa.Attach(pessoaExistente);

                veiculo.pessoa = pessoaExistente;

                veiculo.PessoaId = pessoaExistente.Id;

                var cadastro = await _context.Veiculo.AddAsync(veiculo);

                var resultado = await _context.SaveChangesAsync();

                return Ok("Veículo cadastrado");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar veiculo. Exceção: {e.Message}");
            }
        }

        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutVeiculo([FromBody] Veiculo veiculo)
        {
            try
            {
                var atualizar = _context.Update(veiculo);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do veiculo atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) de (dos) veiculo (s). Exceção{e.Message}");

            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteVeiculo([FromRoute] int id)
        {
            Veiculo veiculo = await _context.Veiculo.FindAsync(id);
            try
            {
                if (veiculo != null)
                {
                    var delete = _context.Veiculo.Remove(veiculo);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Veiculo Removido");
                }
                else
                {
                    return NotFound("Veículo não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de excluir o veiculo. Exceção{e.Message}");

            }
        }

        //méthod para buscar Veículo pelo seu id
        [HttpGet("{id}")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarVeiculoPorID([FromRoute] int id)
        {
            Veiculo veiculo = await _context.Veiculo.FindAsync(id);
            try
            {
                if (veiculo != null)
                {
                    return Ok(veiculo);
                }
                else
                {
                    return NotFound("Veículo não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o veiculo. Exceção: {e.Message}");
            }

        }

        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarVeiculo([FromQuery] string valor)
        {
            try
            {
                valor = valor?.ToUpper() ?? "";

                var lista = from veiculo in await _context.Veiculo.Include(v => v.pessoa).ToListAsync()
                            where veiculo.Placa.ToUpper().Contains(valor)
                               || veiculo.Modelo.ToUpper().Contains(valor)
                               || veiculo.pessoa.Nome.ToUpper().Contains(valor)
                               || veiculo.pessoa.Cpf.Contains(valor)
                            select new
                            {
                                veiculo.Placa,
                                veiculo.Modelo,
                                veiculo.Cor,
                                PessoaNome = veiculo.pessoa.Nome,
                                PessoaCpf = veiculo.pessoa.Cpf
                            };

                return Ok(lista);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o veículo. Exceção: {e.Message}");
            }
        }

        [HttpGet("Paginacao")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetVeiculoPaginacao([FromQuery] string? valor, int skip, int take, bool ordenDesc)
        {
            try
            {
                var lista = _context.Veiculo.AsQueryable();

                if (!String.IsNullOrEmpty(valor))
                {
                    lista = lista.Where(o => o.Placa.ToUpper().Contains(valor.ToUpper())
                                || o.Modelo.ToUpper().Contains(valor.ToUpper())
                                || o.Cor.ToUpper().Contains(valor.ToUpper())
                                || o.pessoa.Nome.ToUpper().Contains(valor.ToUpper())
                                || o.pessoa.Cpf.Contains(valor));
                }

                if (ordenDesc)
                {
                    lista = lista.OrderByDescending(o => o.Modelo);
                }
                else
                {
                    lista = lista.OrderBy(o => o.Modelo);
                }

                var qtde = await lista.CountAsync();

                lista = lista.Skip((skip - 1) * take)
                            .Take(take);

                var listaPaginada = await lista.ToListAsync();

                var paginacaoResponse = new PaginacaoResponse<Veiculo>(listaPaginada, qtde, skip, take);

                return Ok(paginacaoResponse);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na paginação dos veiculos. Exceção: {e.Message}");
            }
        }

    }
}
