using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portaria.Data;
using Portaria.Models;
using Portaria.Services;

namespace Portaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FuncionarioController : Controller
    {
        private readonly PortariaDbContext _context;

        public FuncionarioController(PortariaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetFuncionario()
        {
            try
            {
                var resultado = await _context.Funcionario.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar funcionários. Exceção{e.Message}");

            }
        }

        [HttpPost]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PostFuncionario([FromBody] Funcionario funcionario)
        {
            try
            {
                var cadastro = await _context.AddAsync(funcionario);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Funcionário incluído");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar funcionários. Exceção{e.Message}");

            }
        }

        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutFuncionario([FromBody] Funcionario funcionario)
        {
            try
            {
                var atualizar = _context.Update(funcionario);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do funcionário atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) do (s) funcionário (s). Exceção{e.Message}");

            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteFuncionario([FromRoute] int id)
        {
            Pessoa pessoa = await _context.Pessoa.FindAsync(id);
            try
            {
                if(pessoa != null)
                {
                    var delete = _context.Pessoa.Remove(pessoa);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Funcionário Removido");
                }
                else
                {
                    return NotFound("Funcionário não encontrado");
                }
                
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de remover o funcionário. Exceção{e.Message}");

            }
        }

        //méthod para buscar funcionário pelo seu id
        [HttpGet("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> ProcurarFuncionario([FromRoute] int id)
        {
            Funcionario funcionario = await _context.Funcionario.FindAsync(id);
            try
            {
                if (funcionario != null)
                {
                    return Ok(funcionario);
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
