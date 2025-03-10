using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Swiping
{
    public class UserSwipeCard
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string About { get; set; } = string.Empty;
        public int Distance { get; set; }
        public string? ProfilePicture { get; set; } = string.Empty;        
    }
}
