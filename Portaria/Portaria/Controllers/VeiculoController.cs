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
                var resultado = await _context.Veiculo.ToListAsync();
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
                var cadastro = await _context.AddAsync(veiculo);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Veículo cadastrado");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar veiculo. Exceção{e.Message}");

            }
        }

        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutFuncionario([FromBody] Veiculo veiculo)
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
        public async Task<ActionResult> DeleteFuncionario([FromRoute] int id)
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
        public async Task<ActionResult> ProcurarFuncionario([FromRoute] int id)
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
    }
}
