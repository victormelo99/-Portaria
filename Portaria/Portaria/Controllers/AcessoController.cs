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
                var resultado = await _context.Acesso.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar Acessos. Exceção{e.Message}");

            }
        }

        [HttpPost]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PostAcesso([FromBody] Acesso acesso)
        {
            try
            {
                var cadastro = await _context.AddAsync(acesso);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Acesso cadastrado");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar acesso. Exceção{e.Message}");

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
