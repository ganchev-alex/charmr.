using Server.Models.Utility;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Server.DataAccess.DataTransferObjects.ProfileManagement
{
    public class DetailsPayload
    {
        [Range(1900, 2100, ErrorMessage = "Invalid birth year was provided.")]
        public string birthYear { get; set; }
        public string gender { get; set; }
        public string sexuality { get; set; }
        [MinLength(1, ErrorMessage = "Access to location was denied during the registration proccess.")]
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string locationNormalized { get; set; } = string.Empty;
        public IFormFile profilePic { get; set; }
        [MinLength(3, ErrorMessage = "There must be at least 3 interest.")]
        public List<string> interests { get; set; } = new List<string>();

    }
}
