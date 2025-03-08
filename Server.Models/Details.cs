using Server.Models.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Details
    {
        [Key, ForeignKey("User")]
        public Guid UserId { get; set; }
        public User User { get; set; }
        public int BirthYear { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Sexuality { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationNormalized { get; set; } = string.Empty;
        public string KnownAs { get; set; } = string.Empty;
        public string About { get; set; } = string.Empty;
        public List<string> Interests { get; set; } = new List<string>();
        public bool VerificationStatus { get; set; }
    }
}
