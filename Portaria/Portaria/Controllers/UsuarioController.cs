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
    public class UsuarioController : Controller
    {
        private readonly PortariaDbContext _context;
        private readonly UsuarioLoginService _service;

        public UsuarioController(PortariaDbContext context, UsuarioLoginService service)
        {
            _context = context;
            _service = service;
        }


        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UsuarioLogin usuarioLogin)
        {
            try
            {
                var usuario = await _context.Usuario
                    .Where(x => x.Login == usuarioLogin.Login)
                    .FirstOrDefaultAsync();

                if (usuario == null)
                {
                    return NotFound("Usuário ou senha inválidos.");
                }

                if (!_service.VerificarSenha(usuarioLogin.Senha, usuario.Senha))
                {
                    return BadRequest("Senha inválida");
                }

                var resposta = new
                {
                    RedefinirSenha = usuario.SenhaResetada,
                    usuario.Id
                };

                if (usuario.SenhaResetada)
                {
                    return Ok(resposta);
                }

                var token = _service.GerarToken(usuario);
                usuario.Senha = "";

                var resultado = new UsuarioResponse()
                {
                    usuario = usuario,
                    Token = token
                };

                return Ok(new { RedefinirSenha = false, resultado });
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de realizar o login. Exceção{e.Message}");
            }
        }

        [HttpGet]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> GetUsuario()
        {
            try
            {
                var resultado = await _context.Usuario.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de listar os usuarios. Exceção{e.Message}");

            }
        }

        [HttpPost]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> PostUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var listaUsuario = await _context.Usuario.Where(x => x.Login == usuario.Login).ToListAsync();

                if (listaUsuario.Count > 0)
                {
                    return BadRequest($"Error: Usuário inválido.");

                }

                if (usuario.Senha.Length < 8 || usuario.Senha.Length > 16)
                {
                    return BadRequest("A senha deve ter entre 8 e 16 caracteres.");
                }

                usuario.Senha = _service.Criptografar(usuario.Senha);

                var cadastro = await _context.AddAsync(usuario);
                var resultado = await _context.SaveChangesAsync();

                return Ok("usuario incluído");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de cadastrar usuario. Exceção{e.Message}");

            }
        }

        [HttpPut("alterar-dados")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> AlterarDadosUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var usuarioAtual = await _context.Usuario.FindAsync(usuario.Id);

                usuarioAtual.Nome = usuario.Nome;
                usuarioAtual.Cargo = usuario.Cargo;
                usuarioAtual.Login = usuario.Login;

                if (!string.IsNullOrEmpty(usuario.Senha) && usuario.Senha != usuarioAtual.Senha)
                {
                    if (usuario.Senha.Length < 8 || usuario.Senha.Length > 16)
                    {
                        return BadRequest("A senha deve ter entre 8 e 16 caracteres.");
                    }
                    usuarioAtual.Senha = _service.Criptografar(usuario.Senha);
                    usuarioAtual.SenhaResetada = true;
                }

                _context.Update(usuarioAtual);
                await _context.SaveChangesAsync();

                return Ok("Dados do usuário atualizados com sucesso.");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao atualizar os dados do usuário: {e.Message}");
            }
        }

        [HttpPut("resetar-senha")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> ResetarSenha([FromBody] Usuario usuario)
        {
            try
            {
                var usuarioAtual = await _context.Usuario.FindAsync(usuario.Id);
                if (usuarioAtual == null)
                {
                    return NotFound("Usuário não encontrado.");
                }

                if (!string.IsNullOrEmpty(usuario.Senha))
                {
                    if (usuario.Senha.Length < 8 || usuario.Senha.Length > 16)
                    {
                        return BadRequest("A senha deve ter entre 8 e 16 caracteres.");
                    }
                    usuarioAtual.Senha = _service.Criptografar(usuario.Senha);
                    usuarioAtual.SenhaResetada = false;
                }

                _context.Update(usuarioAtual);
                await _context.SaveChangesAsync();

                return Ok("Senha resetada com sucesso.");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao resetar a senha: {e.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> DeleteUsuario([FromRoute] int id)
        {
            Usuario usuario = await _context.Usuario.FindAsync(id);
            try
            {
                if (usuario != null)
                {
                    var delete = _context.Usuario.Remove(usuario);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Usuário Removido");
                }
                else
                {
                    return NotFound("Usuário não encontrado");
                }

            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de excluir o Usuário. Exceção{e.Message}");

            }
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> ProcurarUsuarioId([FromRoute] int id)
        {
            Usuario usuario = await _context.Usuario.FindAsync(id);
            try
            {
                if (usuario != null)
                {
                    return Ok(usuario);
                }
                else
                {
                    return NotFound("Usuario não encontrado");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o Usuario. Exceção: {e.Message}");
            }
        }

        //méthod para buscar Usuario
        [HttpGet("Pesquisa")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> ProcurarUsuario([FromQuery] string valor)
        {
            try
            {
                var lista = from o in await _context.Usuario.ToListAsync()
                             where o.Nome.ToUpper().Contains(valor.ToUpper())
                             || o.Login.Contains(valor)
                             select o;

                return Ok(lista);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro ao encontrar o Usuario. Exceção: {e.Message}");
            }

        }

        [HttpGet("Paginacao")]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> GetUsuarioPaginacao([FromQuery] string? valor, int skip, int take, bool ordenDesc)
        {
            try
            {
                var lista = _context.Usuario.AsQueryable();

                if (!String.IsNullOrEmpty(valor))
                {
                    lista = lista.Where(o => o.Nome.ToUpper().Contains(valor.ToUpper())
                                || o.Cargo.Contains(valor));
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

                var paginacaoResponse = new PaginacaoResponse<Usuario>(listaPaginada, qtde, skip, take);

                return Ok(paginacaoResponse);
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na paginação de usuário. Exceção: {e.Message}");
            }
        }
    }
}
