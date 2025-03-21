using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.ProfileManagement;
using Server.DataAccess.Repository;
using Server.Models;
using Server.Services.Abstraction;
using Server.Services.Implementation;
using Server.Utility;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController: ControllerBase
    {
        private readonly UnitOfWork _unit;
        private readonly IPhotoService _photoService;

        public AccountController(ApplicationDBContext context, IPhotoService photoService)
        {
            _unit = new UnitOfWork(context);
            _photoService = photoService;
        }

        [Authorize]
        [HttpPost("add-photo")]
        public async Task<IActionResult> AddNewPhoto([FromForm] IFormFile newPhoto)
        {
            var userId = User.ExtractUserId();

            if(userId == null)
            {
                return Unauthorized();
            }

            var uploadResult = await _photoService.AddPhotoAsync(newPhoto);

            if(uploadResult.Error != null)
            {
                return BadRequest();
            }

            var newlyAddedPhoto = new Photo
            {
                Id = Guid.NewGuid(),
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                isMain = false,
                UserId = (Guid)userId,
            };

            _unit.photoRepository.Add(newlyAddedPhoto);

            await _unit.SaveTransaction();

            return Ok(new {url = newlyAddedPhoto.Url, id = newlyAddedPhoto.Id});
        }

        [Authorize]
        [HttpPost("profile-pic")]
        public async Task<IActionResult> ChangeProfilePic([FromBody] ProfilePicChange payload)
        {
            var userId = User.ExtractUserId();

            if(userId == null)
            {
                return Unauthorized();
            }

            var currentProfilePic = await _unit.photoRepository.Get(p => p.UserId == userId && p.Id == payload.currentId);
            var newProfilePic = await _unit.photoRepository.Get(p => p.UserId == userId && p.Id == payload.newId);
            
            if(currentProfilePic == null || newProfilePic == null)
            {
                return NotFound();
            }

            currentProfilePic.isMain = false;
            newProfilePic.isMain = true;

            _unit.photoRepository.Update(currentProfilePic);
            _unit.photoRepository.Update(newProfilePic);

            await _unit.SaveTransaction();

            return Ok(); 
        }

        [Authorize]
        [HttpDelete("remove-pic")]
        public async Task<IActionResult> RemovePicture([FromQuery] Guid deleteId)
        {
            var userId = User.ExtractUserId();

            if(userId == null)
            {
                return Unauthorized();
            }

            var pictureToDelete = await _unit.photoRepository.Get(p => p.UserId == userId && p.Id == deleteId);

            if(pictureToDelete == null)
            {
                return NotFound();
            }

            if(pictureToDelete.isMain)
            {
                return Conflict();
            }

            await _photoService.DeletePhotoAsync(pictureToDelete.PublicId);

            _unit.photoRepository.Delete(pictureToDelete);
            await _unit.SaveTransaction();

            return Created();
        }

        [Authorize]
        [HttpPost("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateDetailsPayload payload)
        {
            var userId = User.ExtractUserId();

            if(userId == null)
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == userId, "Details");

            if (user == null || user.Details == null)
            {
                return NotFound();
            }

            user.Details.KnownAs = payload.KnownAs;
            user.Details.About = payload.About;
            user.Details.Latitude = payload.Latitude == 0 ? user.Details.Latitude : payload.Latitude;
            user.Details.Longitude = payload.Longitude == 0 ? user.Details.Longitude : payload.Longitude;
            user.Details.LocationNormalized = payload.LocationNormalized;
            user.Details.Interests = payload.Interests;

            _unit.userRepository.Update(user, payload.Email);
            _unit.detailsRepository.Update(user.Details);

            await _unit.SaveTransaction();

            return Created();
        }
    }
}
