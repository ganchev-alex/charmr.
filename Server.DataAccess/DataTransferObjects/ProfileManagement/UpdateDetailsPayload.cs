using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.ProfileManagement
{
    public class UpdateDetailsPayload
    {
        [EmailAddress(ErrorMessage = "You must provide a valid email address in order to modify it.")]
        public string Email { get; set; }
        public string KnownAs { get; set; }
        public string About { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationNormalized { get; set; }
        [MinLength(5, ErrorMessage = "You must provide at least 5 new interests.")]
        public List<string> Interests { get; set; }
    }
}
