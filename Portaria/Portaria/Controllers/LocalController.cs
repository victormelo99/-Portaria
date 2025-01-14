using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portaria.Data;
using Portaria.Models;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalController : Controller
    {
        private readonly PortariaDbContext _context;

        public LocalController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetLocal()
        {
            try
            {
                var resultado = await _context.Local.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar os locais. Exceção{e.Message}");

            }
        }

        [HttpPost]
        public async Task<ActionResult> PostLocal([FromBody] Local local)
        {
            try
            {
                var cadastro = await _context.AddAsync(local);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Local incluído");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar local. Exceção{e.Message}");

            }
        }

        [HttpPut]
        public async Task<ActionResult> PutLocal([FromBody] Local local)
        {
            try
            {
                var atualizar = _context.Update(local);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do local atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) do (s) local (s). Exceção{e.Message}");

            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLocal([FromRoute] int id)
        {
            Local local = await _context.Local.FindAsync(id);
            try
            {
                if (local != null)
                {
                    var delete = _context.Local.Remove(local);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Local Removido");
                }
                else
                {
                    return NotFound("Local não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de remover o local. Exceção{e.Message}");

            }
        }

        //méthod para buscar funcionário pelo seu id
        [HttpGet("{id}")]
        public async Task<ActionResult> ProcurarTerceiro([FromRoute] int id)
        {
            Local local = await _context.Local.FindAsync(id);
            try
            {
                if (local != null)
                {
                    return Ok(local);
                }
                else
                {
                    return NotFound("Local não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o local. Exceção: {e.Message}");
            }

        }
    }
}
