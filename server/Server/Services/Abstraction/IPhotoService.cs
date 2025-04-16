using CloudinaryDotNet.Actions;

namespace Server.Services.Abstraction
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile imageFile);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
