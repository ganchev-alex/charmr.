using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Swiping;
using Server.DataAccess.Repository;
using Server.Models;
using Server.Utility;

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
            var userId = User.ExtractUserId();

            if (userId == null)
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
                    (filtering.Gender == defaultPreferedGender ? (user.MatchesOrientation(u)) : (filtering.Gender == "both" ? true : (u.Details.Gender == filtering.Gender)) ) &&
                    filtering.AgeRange[0] <= DateTime.Today.Year - u.Details.BirthYear &&
                    filtering.AgeRange[1] >= DateTime.Today.Year - u.Details.BirthYear &&
                    user.GetDistance(u) <= filtering.LocationRadius &&
                    !likedByTheUser.Contains(u.Id))
                .Select(u => new UserSwipeCard
                {
                    UserId = u.Id,
                    Name = u.FullName,
                    Age = DateTime.UtcNow.Year - u.Details.BirthYear,
                    About = u.Details.About,
                    Distance = Convert.ToInt32(user.GetDistance(u)),
                    ProfilePicture = u.Photos.FirstOrDefault(p => p.isMain)?.Url
                })
                .Take(15)
                .ToList();

            return Ok(deck);
        }

        [Authorize]
        [HttpPost("actions")]
        public async Task<IActionResult> ManageSwipingActions([FromBody] SwipingAction[] swipingActions) {
            var likerUserId = User.ExtractUserId();
            
            if (likerUserId == null)
            {
                return Unauthorized();
            }

            List<Match> matches = new List<Match>();

            foreach(var swipingAction in swipingActions)
            {
                switch(swipingAction.ActionType)
                {
                    case "like":
                        var newMatch = await ManageLike((Guid)likerUserId, Guid.Parse(swipingAction.LikedId), false);
                        if (newMatch != null) matches.Add(newMatch);
                        break;
                    case "super_like":
                        var newSuperMatch = await ManageLike((Guid)likerUserId, Guid.Parse(swipingAction.LikedId), true);
                        if (newSuperMatch != null) matches.Add(newSuperMatch);
                        break;
                    case "pass":
                        await ManageSkip((Guid)likerUserId, Guid.Parse(swipingAction.LikedId));
                        break;
                    default: break;
                }
            }

            await _unit.SaveTransaction();

            if(matches.Count > 0)
            {
                return Ok(new { matches });
            }
            
            return Created();
        }

        private async Task<Match?> ManageLike(Guid likerId, Guid likedId, bool isSuperLike)
        {
            var alreadyLiked = await _unit.likeRepository.Get(l => l.LikerId == likedId && l.LikedId == likerId);
            if(alreadyLiked != null)
            {
                var newMatch = new Match { UserAId = likerId, UserBId = likedId };
                _unit.matchRepository.Add(newMatch);
                _unit.likeRepository.Delete(alreadyLiked);
                return newMatch;
            } 
            else
            {
                _unit.likeRepository.Add(new Like { Id = Guid.NewGuid(), LikerId = likerId, LikedId = likedId, isSuperLike = isSuperLike, likedOn = DateTime.Today });
                return null;
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

        [Authorize]
        [HttpDelete("remove-like")]
        public async Task<IActionResult> RemoveLike([FromQuery] Guid likedId)
        {
            var userId = User.ExtractUserId();

            if(userId == null) {
                return Unauthorized();
            }

            var likeToRemove = await _unit.likeRepository.Get(l => l.LikerId == userId && l.LikedId == likedId);
            
            if(likeToRemove != null)
            {
                _unit.likeRepository.Delete(likeToRemove);
            }

            await _unit.SaveTransaction();

            return Created();
        }
    }
}
