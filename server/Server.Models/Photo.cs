using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Photo
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool isMain { get; set; }
        public string PublicId { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
