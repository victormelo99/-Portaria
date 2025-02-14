﻿using Microsoft.AspNetCore.Authorization;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _context.AddAsync(funcionario);
                await _context.SaveChangesAsync();
                return Ok("Funcionário incluído" );
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar funcionários. Exceção: {e.Message}");
            }
        }

        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutFuncionario([FromBody] Funcionario funcionario)
        {
            try
            {
                var funcionarioExistente = await _context.Funcionario
                    .FirstOrDefaultAsync(f => f.Id == funcionario.Id);

                if (funcionarioExistente == null)
                {
                    return NotFound("Funcionário não encontrado.");
                }

                funcionarioExistente.Nome = funcionario.Nome;
                funcionarioExistente.Cpf = funcionario.Cpf;
                funcionarioExistente.Matricula = funcionario.Matricula;
                funcionarioExistente.DataAdmissao = funcionario.DataAdmissao;
                funcionarioExistente.DataDesligamento = funcionario.DataDesligamento;
                funcionarioExistente.Status = funcionario.Status;

                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado(s) do funcionário atualizado(s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao atualizar o(s) dado(s) do(s) funcionário(s). Exceção: {e.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteFuncionario([FromRoute] int id)
        {
            Pessoa pessoa = await _context.Pessoa.FindAsync(id);
            try
            {
                if (pessoa != null)
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

        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ProcurarFuncionario([FromQuery] string valor)
        {
            try
            {
                var lista = from o in await _context.Funcionario.ToListAsync()
                            where o.Nome.ToUpper().Contains(valor.ToUpper())
                            || o.Cpf.Contains(valor) || o.Matricula.ToString().Contains(valor)
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
        public async Task<ActionResult> GetFuncionarioPaginacao([FromQuery] string? valor, int skip, int take, bool ordenDesc)
        {
            try
            {
                var lista = _context.Funcionario.AsQueryable();

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

                var paginacaoResponse = new PaginacaoResponse<Funcionario>(listaPaginada, qtde, skip, take);

                return Ok(paginacaoResponse);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na paginação de Funcionário. Exceção: {e.Message}");
            }
        }

    }
}
