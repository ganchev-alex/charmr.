using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Swiping
{
    public class MatchPayload
    {
        public Guid MatchedUserId { get; set; } 
        public string Username { get; set; }
        public string ProfilePicture { get; set; }       
    }
}
