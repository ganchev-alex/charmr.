using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.DataAccess.DataTransferObjects.Authentication;
using System.Security.Cryptography;
using Server.DataAccess.Repository;
using Server.DataAccess.Database;
using System.Text;
using Server.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private UnitOfWork _unit;
        private ITokenService _tokenService;
        public AuthenticationController(ApplicationDBContext context, ITokenService tokenService)
        {
            _unit = new UnitOfWork(context);
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<AuthenticatedCredentials>> Register([FromBody] RegistrationPayload registrationPayload)
        {
            var userAlreadyExists = await _unit.userRepository.Get(u => string.Equals(u.Email, registrationPayload.email));
            if(userAlreadyExists != null)
            {
                return Conflict(new { message = "User with that credentials (email) already exists." });
            }

            using var hmac = new HMACSHA512();
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = registrationPayload.fullName,
                Email = registrationPayload.email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registrationPayload.password)),
                PasswordSalt = hmac.Key
            };

            _unit.userRepository.Add(user);
            await _unit.SaveTransaction();

            return new AuthenticatedCredentials { userId = user.Id, token = _tokenService.CreateToken(user) };
        }

        [AllowAnonymous]
        [HttpPost("login")]

        public async Task<ActionResult<AuthenticatedCredentials>> Login([FromBody] LoginPayload loginPayload)
        {
            var user = await _unit.userRepository.Get(u => string.Equals(u.Email, loginPayload.email));
            if(user == null)
            {
                return NotFound(new { message = "User with those credentials wasn't found." });
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginPayload.password));

            for(int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized(new { message = "The password you have provided is invalid." });
            }

            return new AuthenticatedCredentials { userId = user.Id, token = _tokenService.CreateToken(user) };
        }
    }
}
