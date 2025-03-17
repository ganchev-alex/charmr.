using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Retrieving
{
    public class LikePayload
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public int Distance { get; set; }
        public string ProfilePicture { get; set; }
        public DateTime LikedOn { get; set; }
       
    }
}
