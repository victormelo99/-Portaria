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
    public class  TerceiroController : Controller
    {
        private readonly PortariaDbContext _context;

        public TerceiroController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetTerceiro()
        {
            try
            {
                var resultado = await _context.Terceiro.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar terceiros. Exceção{e.Message}");

            }
        }

        [HttpPost]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PostTerceiro([FromBody] Terceiro terceiro)
        {
            try
            {
                var cadastro = await _context.AddAsync(terceiro);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Funcionário incluído");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar terceiro. Exceção{e.Message}");

            }
        }
        [HttpPatch]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PatchTerceiro([FromBody] Terceiro terceiro)
        {
            try
            {
                var atualizar = _context.Update(terceiro);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado(s) do terceiro atualizado(s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o(s) dado(s) do(s) terceiro(s). Exceção: {e.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteTerceiro([FromRoute] int id)
        {
            Pessoa pessoa = await _context.Pessoa.FindAsync(id);
            try
            {
                if (pessoa != null)
                {
                    var delete = _context.Pessoa.Remove(pessoa);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Terceiro Removido");
                }
                else
                {
                    return NotFound("Terceiro não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de remover o Terceiro. Exceção{e.Message}");

            }
        }

        //méthod para buscar Terceiro pelo seu id
        [HttpGet("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> ProcurarTerceiro([FromRoute] int id)
        {
            Terceiro terceiro = await _context.Terceiro.FindAsync(id);
            try
            {
                if (terceiro != null)
                {
                    return Ok(terceiro);
                }
                else
                {
                    return NotFound("Terceiro não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o terceiro. Exceção: {e.Message}");
            }

        }


        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarTerceiro([FromQuery] string valor)
        {
            try
            {
                var lista = from o in await _context.Terceiro.ToListAsync()
                            where o.Nome.ToUpper().Contains(valor.ToUpper())
                            || o.Cpf.Contains(valor) || o.Empresa.Contains(valor)
                            select o;

                return Ok(lista);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o Local. Exceção: {e.Message}");
            }

        }

        [HttpGet("Paginacao")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetTerceiroPaginacao([FromQuery] string? valor, int skip, int take, bool ordenDesc)
        {
            try
            {
                var lista = _context.Terceiro.AsQueryable();

                if (!String.IsNullOrEmpty(valor))
                {
                    lista = lista.Where(o => o.Nome.ToUpper().Contains(valor.ToUpper())
                                || o.Cpf.Contains(valor));
                }

                if (ordenDesc)
                {
                    lista = lista.OrderByDescending(o => o.Nome);
                }
                else
                {
                    lista = lista.OrderBy(o => o.Nome);
                }

                var qtde = await lista.CountAsync();

                lista = lista.Skip((skip - 1) * take)
                            .Take(take);

                var listaPaginada = await lista.ToListAsync();

                var paginacaoResponse = new PaginacaoResponse<Terceiro>(listaPaginada, qtde, skip, take);

                return Ok(paginacaoResponse);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na paginação de Terceiro. Exceção: {e.Message}");
            }
        }
    }
}
