using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portaria.Data;
using Portaria.Models;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class  TerceiroController : Controller
    {
        private readonly PortariaDbContext _context;

        public TerceiroController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetTerceiro()
        {
            try
            {
                var resultado = await _context.Funcionario.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar terceiros. Exceção{e.Message}");

            }
        }

        [HttpPost]
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

        [HttpPut]
        public async Task<ActionResult> PutTerceiro([FromBody] Terceiro terceiro)
        {
            try
            {
                var atualizar = _context.Update(terceiro);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do terceiro atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) do (s) terceiro (s). Exceção{e.Message}");

            }
        }

        [HttpDelete("{id}")]
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

        //méthod para buscar funcionário pelo seu id
        [HttpGet("{id}")]
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
                    return NotFound("funcionario não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o funcionario. Exceção: {e.Message}");
            }

        }
    }
}
