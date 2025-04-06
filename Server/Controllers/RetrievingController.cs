using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Retrieving;
using Server.DataAccess.DataTransferObjects.Swiping;
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
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details,Photos");

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

            var userFiltering = new DefaultUserFiltering
            {
                LocationRadius = 30,
                Gender = selectedGender,
                AgeRange = [DateTime.UtcNow.Year - user.Details.BirthYear - 2, DateTime.UtcNow.Year - user.Details.BirthYear + 2]
            };

            var userData = new UserData
            {
                Credentials = new UserCredentials
                {
                    Email = user.Email,
                    FullName = user.FullName,
                    VerificationStatus = user.Details.VerificationStatus,
                },
                Details = new UserDetails
                {
                    KnownAs = user.Details.KnownAs,
                    About = user.Details.About,
                    Age = user.CalculateAge(),
                    Gender = user.Details.Gender,
                    Sexuality = user.Details.Sexuality,
                    LocationNormalized = user.Details.LocationNormalized,
                    Interests = user.Details.Interests
                },
                ProfilePicture = user.Photos.Where(p => p.isMain).Select(p => new PhotoDetails { Id = p.Id, Url = p.Url }).FirstOrDefault(),
                Gallery = user.Photos.Select(p => new PhotoDetails { Id = p.Id, Url = p.Url }).ToList()
            };

            return Ok(new {userFiltering, userData});
        }

        [Authorize]
        [HttpGet("likes")]
        public async Task<ActionResult> RetriveLikesCollections()
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
                IsSuperLike = like.isSuperLike,
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
                IsSuperLike = like.isSuperLike,
                LikedOn = like.likedOn
            })
            .OrderByDescending(l => l.LikedOn)
            .ToList();
            
            return Ok(new {likesGiven = likesGivenPayload, likesReceived = likesReceivedPayload}); 
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<ProfilePreview>> PreviewProfile([FromQuery] Guid userId)
        {
            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details,Photos");

            if(user == null)
            {
                return NotFound();
            }

            var previewProfileData = new ProfilePreview
            {
                FullName = user.FullName,
                KnownAs = user.Details.KnownAs,
                About = user.Details.About,
                Age = user.CalculateAge(),
                Gender = user.Details.Gender,
                Sexuality = user.Details.Sexuality,
                LocationNormalized = user.Details.LocationNormalized,
                Interests = user.Details.Interests,
                ProfilePicture = user.Photos.Where(p => p.isMain).Select(p => new PhotoDetails { Id = p.Id, Url = p.Url }).FirstOrDefault(),
                Gallery = user.Photos.Where(p => !p.isMain).Select(p => new PhotoDetails { Id = p.Id, Url = p.Url }).ToList()
            };

            return Ok(previewProfileData);
        }


        [Authorize]
        [HttpGet("matches")]
        public async Task<ActionResult<List<MatchPayload>>> RetrieveMatches()
        {
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var matches = await _unit.matchRepository.GetAll((m) => m.UserAId == userId || m.UserBId == userId);

            if (matches == null)
            {
                return Ok(new { matches = new List<MatchPayload>() });
            }

            var matchesPayload = new List<MatchPayload>();

            foreach (var match in matches)
            {
                var matchedUserId = match.UserAId == userId ? match.UserBId : match.UserAId;
                var matchedUser = await _unit.userRepository.Get(u => u.Id == matchedUserId, "Photos");
                if (matchedUser != null)
                {
                    matchesPayload.Add(new MatchPayload
                    {
                        MatchedUserId = matchedUserId,
                        Username = matchedUser.FullName,
                        ProfilePicture = matchedUser.Photos.Where(p => p.isMain).FirstOrDefault().Url ?? ""
                    });
                }
            }

            return Ok(new { matches = matchesPayload });
        }
    }
}
