using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Server.DataAccess.Repository;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Server.DataAccess.Database
{
    public class DataSeeder
    {
        private readonly UnitOfWork _unit;
        private readonly IHostEnvironment _environment;

        public DataSeeder(ApplicationDBContext context, IHostEnvironment environment)
        {
            _environment = environment;
            _unit = new UnitOfWork(context);
        }

        public async Task SeedDataAsync()
        {
            string sourceFile = "C:\\Users\\ganch\\Documents\\coding_repositories\\dating-app\\server\\Server\\Server.DataAccess\\Database\\users.json";
            if (!File.Exists(sourceFile)) return;

            var jsonData = await File.ReadAllTextAsync(sourceFile);
            var usersData = JsonSerializer.Deserialize<List<UserDTO>>(jsonData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (usersData == null) return;

            foreach (var userDTO in usersData)
            {
                if(await _unit.userRepository.Get(u => u.Email == userDTO.Email) == null)
                {
                    using var hmac = new HMACSHA512();
                    var user = new User
                    {
                        Id = Guid.NewGuid(),
                        FullName = userDTO.FullName,
                        Email = userDTO.Email,
                        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rt")),
                        PasswordSalt = hmac.Key
                    };

                    _unit.userRepository.Add(user);

                    if (userDTO.Details != null)
                    {
                        var details = new Details
                        {
                            UserId = user.Id,
                            BirthYear = userDTO.Details.BirthYear,
                            Gender = userDTO.Details.Gender,
                            Sexuality = userDTO.Details.Sexuality,
                            Latitude = userDTO.Details.Latitude,
                            Longitude = userDTO.Details.Longitude,
                            LocationNormalized = userDTO.Details.LocationNormalized,
                            KnownAs = userDTO.Details.KnownAs,
                            About = userDTO.Details.About,
                            Interests = userDTO.Details.Interests ?? new List<string>(),
                            VerificationStatus = true,
                        };

                        _unit.detailsRepository.Add(details);
                    }

                    if (userDTO.Photos != null)
                    {
                        foreach (var photoDto in userDTO.Photos)
                        {
                            var photo = new Photo
                            {
                                Id = Guid.NewGuid(),
                                Url = photoDto.Url,
                                isMain = photoDto.isMain,
                                UserId = user.Id
                            };

                            _unit.photoRepository.Add(photo);
                        }
                    }

                    await _unit.SaveTransaction();
                }                
            }
        }
    }

    class UserDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DetailsDTO? Details { get; set; }
        public List<PhotoDTO>? Photos { get; set; }
    }
    class DetailsDTO
    {
        public int BirthYear { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Sexuality { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationNormalized { get; set; } = string.Empty;
        public string KnownAs { get; set; } = string.Empty;
        public string About { get; set; } = string.Empty;
        public List<string> Interests { get; set; } = new();
    }
    class PhotoDTO
    {
        public string Url { get; set; } = string.Empty;
        public bool isMain { get; set; }
    }
}
