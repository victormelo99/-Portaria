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
                    return BadRequest(new { message = "Senha inválida." });
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
            catch (Exception ex)
            {
                Console.WriteLine($"Erro no servidor: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno no servidor. Tente novamente mais tarde." });
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

        [HttpPut]
        [Authorize(Roles = "TI,PORTARIA")]
        public async Task<ActionResult> PutUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var usuarioAtual = await _context.Usuario.FindAsync(usuario.Id);
                if (usuarioAtual == null)
                {
                    return NotFound("Usuário não encontrado.");
                }

                // Verifica quem está alterando os dados
                var usuarioAlterando = await _context.Usuario
                    .Where(u => u.Login == User.Identity.Name)
                    .FirstOrDefaultAsync();

                if (usuarioAlterando.Cargo == "PORTARIA")
                {
                    // Permite que o usuário PORTARIA altere apenas a própria senha
                    if (usuario.Id != usuarioAlterando.Id)
                    {
                        return BadRequest("Usuários com cargo de PORTARIA não podem atualizar os dados de outros usuários.");
                    }

                    // Altera a senha do usuário e marca como 'resetada'
                    if (!string.IsNullOrEmpty(usuario.Senha) && usuario.Senha != usuarioAtual.Senha)
                    {
                        if (usuario.Senha.Length < 8 || usuario.Senha.Length > 16)
                        {
                            return BadRequest("A senha deve ter entre 8 e 16 caracteres.");
                        }

                        usuarioAtual.Senha = _service.Criptografar(usuario.Senha);

                        // Verifica se a alteração foi feita pelo próprio usuário
                        if (usuario.Id == usuarioAlterando.Id)
                        {
                            usuarioAtual.SenhaResetada = false;  // Se for o próprio usuário, marca como 'false'
                        }
                        else
                        {
                            usuarioAtual.SenhaResetada = true;   // Se for outro usuário, marca como 'true'
                        }
                    }
                }
                else
                {
                    // Caso o cargo seja "TI", permite alteração dos dados do usuário
                    usuarioAtual.Nome = usuario.Nome;
                    usuarioAtual.Cargo = usuario.Cargo;
                    usuarioAtual.Login = usuario.Login;

                    // Altera a senha do usuário e marca como 'resetada'
                    if (!string.IsNullOrEmpty(usuario.Senha) && usuario.Senha != usuarioAtual.Senha)
                    {
                        if (usuario.Senha.Length < 8 || usuario.Senha.Length > 16)
                        {
                            return BadRequest("A senha deve ter entre 8 e 16 caracteres.");
                        }

                        usuarioAtual.Senha = _service.Criptografar(usuario.Senha);

                        // Se o usuário for o próprio dono, marca 'SenhaResetada' como 'false'
                        if (usuario.Id == usuarioAlterando.Id)
                        {
                            usuarioAtual.SenhaResetada = false;
                        }
                    }
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
    }
}
