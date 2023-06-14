using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using RaspWebSite.Interfaces;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RaspWebSite.Services
{
    public class TokenService : IJWTTokenGen
    {

        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken<T>(IdentityUser<T> user) where T : IEquatable<T>
        {
            return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                new[] {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Somewhat unique ID.
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)), // Issued at.
                    new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString() ?? throw new ArgumentNullException(nameof(user))), // User's ID.
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName ?? throw new ArgumentNullException(nameof(user))), // User's name.
                },
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddDays(1),
                new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new SecurityTokenInvalidSigningKeyException())),
                    SecurityAlgorithms.HmacSha256)));
        }

    }
}
