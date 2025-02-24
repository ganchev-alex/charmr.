using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.DataAccess.DataTransferObjects.Authentication;
using System.Security.Cryptography;
using Server.DataAccess.Repository;
using Server.DataAccess.Database;
using System.Text;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private UnitOfWork _unit;
        public AuthenticationController(ApplicationDBContext context)
        {
            _unit = new UnitOfWork(context);    
        }

        [HttpPost("register")]
        public async Task<ActionResult<SuccessfulRegistration>> Register([FromBody] RegistrationPayload registrationPayload)
        {
            var userAlreadyExists = await this._unit.userRepository.Get(u => string.Equals(u.Email, registrationPayload.email));
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

            this._unit.userRepository.Add(user);
            await this._unit.SaveTransaction();

            return new SuccessfulRegistration { userId = user.Id, token = "" };
        }
    }
}
