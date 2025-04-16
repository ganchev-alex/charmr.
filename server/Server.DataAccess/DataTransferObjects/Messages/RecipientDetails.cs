using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Messages
{
    public class RecipientDetails
    {
        public Guid RecipientId { get; set; }
        public string Fullname { get; set; }
        public int Age { get; set; }
        public string ProfilePic { get; set; }
    }
}
