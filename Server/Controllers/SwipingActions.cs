using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Swiping;
using Server.DataAccess.Repository;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/swiping")]
    public class SwipingActionsController : ControllerBase
    {
        private readonly UnitOfWork _unit;

        public SwipingActionsController(ApplicationDBContext context)
        {
            _unit = new UnitOfWork(context);
        }

        [Authorize]
        [HttpPost("deck")]
        public async Task<ActionResult<List<UserSwipeCard>?>> PrepareDeck([FromBody] DeckFiltering filtering)
        {
            var userIdClaim = User.FindFirst("NameId")?.Value.ToUpper();

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details,LikesGiven");
            var allUsers = await _unit.userRepository.GetAll(u => u.Id != userId, "Details,Photos");

            if(allUsers==null || user == null)
            {
                return NotFound();
            }

            var likedByTheUser = user.LikesGiven.Select(like => like.LikedId).ToHashSet();

            string defaultPreferedGender;
            switch (user.Details.Sexuality)
            {
                case "heterosexual":
                    defaultPreferedGender = user.Details.Gender == "male" ? "female" : "male"; break;
                case "homosexual":
                    defaultPreferedGender = user.Details.Gender; break;
                case "bisexual":
                case "without_preference":
                    defaultPreferedGender = "both"; break;
                default:
                    defaultPreferedGender = "both"; break;
            }

            var deck = allUsers
                .Where(u => u.Details != null &&
                    (filtering.Gender == defaultPreferedGender ? (MatchesOrientation(user.Details.Gender, user.Details.Sexuality, u.Details.Gender, u.Details.Sexuality)) : (filtering.Gender == "both" ? true : (u.Details.Gender == filtering.Gender)) ) &&
                    filtering.AgeRange[0] <= DateTime.Today.Year - u.Details.BirthYear &&
                    filtering.AgeRange[1] >= DateTime.Today.Year - u.Details.BirthYear &&
                    GetDistance(user.Details.Latitude, user.Details.Longitude, u.Details.Latitude, u.Details.Longitude) <= filtering.LocationRadius &&
                    !likedByTheUser.Contains(u.Id))
                .Select(u => new UserSwipeCard
                {
                    UserId = u.Id,
                    Name = u.FullName,
                    Age = DateTime.UtcNow.Year - u.Details.BirthYear,
                    About = u.Details.About,
                    Distance = Convert.ToInt32(GetDistance(user.Details.Latitude, user.Details.Longitude, u.Details.Latitude, u.Details.Longitude)),
                    ProfilePicture = u.Photos.FirstOrDefault(p => p.isMain)?.Url
                })
                .Take(15)
                .ToList();

            return Ok(deck);
        }

        private bool MatchesOrientation(string userGender, string userOrientation, string candidateGender, string candidateOrientation)
        {

            if (userOrientation == "heterosexual")
            {
                return (userGender == "male" && candidateGender == "female" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference")) ||
                       (userGender == "female" && candidateGender == "male" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference"));
            }
            else if (userOrientation == "homosexual")
            {
                return (userGender == candidateGender) && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference");
            }
            else if (userOrientation == "bisexual" || userOrientation == "without_preference")
            {
                return (userGender == "male" && (candidateGender == "female" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference") ||
                                                 candidateGender == "male" && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference"))) ||
                       (userGender == "female" && (candidateGender == "male" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference") ||
                                                   candidateGender == "female" && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference")));
            }

            return false;
        }

        private double DegreesToRadians(double degrees) => degrees * (Math.PI / 180);
        private double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c; 
        }

        [Authorize]
        [HttpPost("actions")]
        public async Task<IActionResult> ManageSwipingActions([FromBody] SwipingAction[] swipingActions) {
            var userIdClaim = User.FindFirst("NameId")?.Value.ToUpper();
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid likerUserId))
            {
                return Unauthorized();
            }

            foreach(var swipingAction in swipingActions)
            {
                switch(swipingAction.ActionType)
                {
                    case "like":
                        await ManageLike(likerUserId, Guid.Parse(swipingAction.LikedId), false);
                        break;
                    case "super_like":
                        await ManageLike(likerUserId, Guid.Parse(swipingAction.LikedId), true);
                        break;
                    case "pass":
                        await ManageSkip(likerUserId, Guid.Parse(swipingAction.LikedId));
                        break;
                    default: break;
                }
            }

            await _unit.SaveTransaction();
            
            return Created();
        }

        private async Task ManageLike(Guid likerId, Guid likedId, bool isSuperLike)
        {
            var alreadyLiked = await _unit.likeRepository.Get(l => l.LikerId == likedId && l.LikedId == likerId);
            if(alreadyLiked != null)
            {
                _unit.matchRepository.Add(new Match { UserAId = likerId, UserBId = likedId });
                _unit.likeRepository.Delete(alreadyLiked);
            } 
            else
            {
                _unit.likeRepository.Add(new Like { Id = Guid.NewGuid(), LikerId = likerId, LikedId = likedId, isSuperLike = isSuperLike, likedOn = DateTime.Today });
            }
        }
        private async Task ManageSkip(Guid skiperId, Guid skipedId)
        {
            var userIdClaim = User.FindFirst("NameId")?.Value.ToUpper();

            var existingLike = await _unit.likeRepository.Get(l => l.LikerId == skipedId && l.LikedId == skiperId);
            if(existingLike != null)
            {
                _unit.likeRepository.Delete(existingLike);
            }
        }
    }
}
