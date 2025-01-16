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
            var usuario = await _context.Usuario.Where(x => x.Login == usuarioLogin.Login).FirstOrDefaultAsync();
            
            if (usuario == null)
            {
                return NotFound("Usuario inválido");
            }

            if (!_service.VerificarSenha(usuarioLogin.Senha, usuario.Senha))
            {
                return BadRequest("Senha inválida.");
            }

            var token = _service.GerarToken(usuario);

            usuario.Senha = "";

            var resultado = new UsuarioResponse()
            {
                usuario = usuario,
                Token = token
            };

            return Ok(resultado);
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
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> PutUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var atualizar = _context.Update(usuario);
                var resultado = await _context.SaveChangesAsync();
                return Ok("Dado (s) do usuario atualizado (s)");
            }
            catch (Exception e)
            {
                return BadRequest($"Erro na hora de atualizar o/os dado (s) do (s) usuario. Exceção{e.Message}");

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

        //méthod para buscar Usuario pelo seu id
        [HttpGet("{id}")]
        [Authorize(Roles = "TI")]
        public async Task<ActionResult> ProcurarUsuario([FromRoute] int id)
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
    }
}
