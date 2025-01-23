using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;
using Portaria.Data;
using Portaria.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portaria.Services
{
    public class UsuarioLoginService
    {
        private readonly PortariaDbContext _context;
        private readonly IConfiguration _configuration;


        public UsuarioLoginService(PortariaDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public string GerarToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var chave = Encoding.ASCII.GetBytes(_configuration.GetSection("Chave").Get<String>());

            var Desencriptar = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                        [
                            new Claim(ClaimTypes.Name, usuario.Login.ToString()),
                            new Claim(ClaimTypes.Role, usuario.Cargo.ToString()),

                        ]
                 ),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(chave),SecurityAlgorithms.HmacSha256Signature
                 )
            };

            var token = tokenHandler.CreateToken(Desencriptar);

            return tokenHandler.WriteToken(token);
        }

        public string Criptografar(string senha) {
            string senhaHash = BCrypt.Net.BCrypt.HashPassword(senha,12);

            return senhaHash;
        }

        public bool VerificarSenha(string senhaDigitada, string senhaHash)
        {
            return BCrypt.Net.BCrypt.Verify(senhaDigitada, senhaHash);
        }

    }
}
