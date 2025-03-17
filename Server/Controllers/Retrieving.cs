using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Retrieving;
using Server.DataAccess.Repository;
using Server.Models;
using Server.Utility;

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

        [Authorize]
        [HttpGet("likes")]
        public async Task<ActionResult> RetriveLikedUsers()
        {
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details");
            var receivedLikes = await _unit.likeRepository.GetAll(l => l.LikedId == userId, "Liker,Liker.Photos,Liker.Details");
            var givenLikes = await _unit.likeRepository.GetAll(l => l.LikerId == userId, "Liked,Liked.Photos,Liked.Details");

            if(user == null || givenLikes == null)
            {
                return NotFound();
            }

            var likesReceivedPayload = receivedLikes.Select(like => new LikePayload
            {
                UserId = like.LikerId.ToString(),
                Name = like.Liker.FullName,
                Age = like.Liker.CalculateAge(),
                Distance = (int)like.Liker.GetDistance(user),
                ProfilePicture = like.Liker.Photos.Where(p => p.isMain).Select(p => p.Url).FirstOrDefault() ?? "",
                LikedOn = like.likedOn
            })
            .OrderByDescending(l => l.LikedOn)
            .ToList();

            var likesGivenPayload = givenLikes.Select(like => new LikePayload
            {
                UserId = like.LikedId.ToString(),
                Name = like.Liked.FullName,
                Age = like.Liked.CalculateAge(),
                Distance = (int)like.Liked.GetDistance(user),
                ProfilePicture = like.Liked.Photos.Where(p => p.isMain).Select(p => p.Url).FirstOrDefault() ?? "",
                LikedOn = like.likedOn
            })
            .OrderByDescending(l => l.LikedOn)
            .ToList();
            
            return Ok(new {likesGiven = likesGivenPayload, likesReceived = likesReceivedPayload}); 
        }
    }
}
