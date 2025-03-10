using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Retrieving;
using Server.DataAccess.Repository;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/retrieve")]
    public class RetrievingController : ControllerBase
    {
        private readonly UnitOfWork _unit;

        public RetrievingController(ApplicationDBContext context)    
        {
            _unit = new UnitOfWork(context);
        }

        [Authorize]
        [HttpGet("load-user")]
        public async Task<ActionResult> LoadUser()
        {
            var userIdClaim = User.FindFirst("NameId")?.Value.ToUpper();

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details");

            if(user == null)
            {
                return NotFound();
            }

            string selectedGender;
            switch (user.Details.Sexuality)
            {
                case "heterosexual":
                    selectedGender = user.Details.Gender == "male" ? "female" : "male"; break;
                case "homosexual":
                    selectedGender = user.Details.Gender; break;
                case "bisexual":
                case "without_preference":
                    selectedGender = "both"; break;
                default:
                    selectedGender = "both"; break;
            }

            var userPayload = new DefaultUserFiltering
            {
                LocationRadius = 30,
                Gender = selectedGender,
                AgeRange = [DateTime.UtcNow.Year - user.Details.BirthYear - 2, DateTime.UtcNow.Year - user.Details.BirthYear + 2]
            };

            return Ok(userPayload);
        }
    }
}
