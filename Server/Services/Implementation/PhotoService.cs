using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Server.Services.Abstraction;

namespace Server.Services.Implementation
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config)
        {
            _cloudinary = new Cloudinary(new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            ));
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile imageFile)
        {
            var uploadedResult = new ImageUploadResult();

            if(imageFile.Length > 0)
            {
                using var stream = imageFile.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(imageFile.FileName, stream),

                };
                uploadedResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadedResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deleteParams);

            return deletionResult;
        }
    }
}
