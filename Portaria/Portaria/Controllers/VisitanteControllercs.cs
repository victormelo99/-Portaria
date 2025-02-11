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
    public class VisitanteController : Controller
    {
        private readonly PortariaDbContext _context;

        public VisitanteController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetVisitante()
        {
            try
            {
                var resultado = await _context.Visitante.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar os visitantes. Exceção: {e.Message}");

            }
        }

        [HttpPost]
        public async Task<ActionResult> PostVisitante([FromBody] Visitante visitante)
        {
            try
            {
                var cadastro = await _context.AddAsync(visitante);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Visitante incluído");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar o visitante. Exceção: {e.Message}");

            }
        }

        [HttpPut]
        public async Task<ActionResult> PutVisitante([FromBody] Visitante visitante)
        {
            try
            {
                var atualizar = _context.Update(visitante);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do visitante atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) do (s) visitante (s). Exceção: {e.Message}");

            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVisitante([FromRoute] int id)
        {
            Pessoa pessoa = await _context.Pessoa.FindAsync(id);
            try
            {
                if (pessoa != null)
                {
                    var delete = _context.Pessoa.Remove(pessoa);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Visitante Removido");
                }
                else
                {
                    return NotFound("Visitante não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao remover o visitante. Exceção: {e.Message}");

            }
        }

        //méthod para buscar visitante pelo seu id
        [HttpGet("{id}")]
        public async Task<ActionResult> ProcurarVisitanteId([FromRoute] int id)
        {
            Visitante visitante = await _context.Visitante.FindAsync(id);
            try
            {
                if (visitante != null)
                {
                    return Ok(visitante);
                }
                else
                {
                    return NotFound("Visitante não encontrado");
                }
            }
            catch (Exception e) {
                return BadRequest($"Erro ao encontrar o visitante. Exceção: {e.Message}");
            }
           
        }


        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarVisitante([FromQuery] string valor)
        {
            try
            {
                var lista = from o in await _context.Visitante.ToListAsync()
                            where o.Nome.ToUpper().Contains(valor.ToUpper())
                            || o.Cpf.Contains(valor)
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
        public async Task<ActionResult> GetVisitantePaginacao([FromQuery] string? valor, int skip, int take, bool ordenDesc)
        {
            try
            {
                var lista = _context.Visitante.AsQueryable();

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

                var paginacaoResponse = new PaginacaoResponse<Visitante>(listaPaginada, qtde, skip, take);

                return Ok(paginacaoResponse);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na paginação de visitante. Exceção: {e.Message}");
            }
        }
    }
}
