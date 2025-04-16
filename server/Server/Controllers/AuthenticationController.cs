using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.DataAccess.DataTransferObjects.Authentication;
using Server.DataAccess.DataTransferObjects.ProfileManagement;
using System.Security.Cryptography;
using Server.DataAccess.Repository;
using Server.DataAccess.Database;
using System.Text;
using Server.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;
using Server.Models.Utility;
using Server.Utility;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private UnitOfWork _unit;
        private ITokenService _tokenService;
        private IPhotoService _photoService;
        public AuthenticationController(ApplicationDBContext context, ITokenService tokenService, IPhotoService photoService)
        {
            _unit = new UnitOfWork(context);
            _tokenService = tokenService;
            _photoService = photoService;
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
            _unit.detailsRepository.Add(new Details
            {
                UserId = user.Id
            });
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
                    return Unauthorized(new { message = "The password you have provided is incorrect." });
            }

            return new AuthenticatedCredentials { userId = user.Id, token = _tokenService.CreateToken(user) };
        }

        [Authorize]
        [HttpPost("register-details")]

        public async Task<IActionResult> SetDetails([FromForm] DetailsPayload detailsPayload)
        {
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var userDetails = await _unit.detailsRepository.Get(d => d.UserId == userId);
            if (userDetails == null)
            {
                return NotFound(new { message = "User couldn't be identified." });
            }

            if (!Enum.TryParse(detailsPayload.gender, out SexEnum sexEnum))
            {
                return BadRequest(new { message = "Invalid sex value." });
            }

            if (!Enum.TryParse(detailsPayload.sexuality, out SexualityEnum sexualityEnum))
            {
                return BadRequest(new { message = "Invalid sexuality value." });
            }

            var uploadResult = await _photoService.AddPhotoAsync(detailsPayload.profilePic);

            if (uploadResult.Error != null)
            {
                return BadRequest(new { message = "Image uploading couldn't be procced.", errorDetails = uploadResult.Error.Message });
            }

            var profilePic = new Photo
            {
                Id = Guid.NewGuid(),
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                isMain = true,
                UserId = userDetails.UserId
            };

            _unit.photoRepository.Add(profilePic);

            _unit.detailsRepository.Update(new Details
            {
                UserId = userDetails.UserId,
                BirthYear = int.Parse(detailsPayload.birthYear),
                Gender = detailsPayload.gender.ToLower(),
                Sexuality = detailsPayload.sexuality.ToLower(),
                Latitude = double.Parse(detailsPayload.latitude),
                Longitude = double.Parse(detailsPayload.longitude),
                LocationNormalized = detailsPayload.locationNormalized,
                KnownAs = "",
                About = "",
                Interests = detailsPayload.interests,
                VerificationStatus = true
            });

            await _unit.SaveTransaction();

            return Accepted();
        }

        [HttpGet("debug-token")]
        public IActionResult DebugToken()
        {

            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

            return Ok(new { message = "Claims retrieved successfully", claims });
        }

    }
}
