using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portaria.Data;
using Portaria.Models;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult> ProcurarVisitante([FromRoute] int id)
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
    }
}
