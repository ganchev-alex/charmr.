using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Messages
{
    public class ChatDetails
    {
        public Guid InterlocutorId { get; set; }
        public string IntelocutorName { get; set; }
        public string InterlocutorProfilePic { get; set; }
        public string LastMessageContent { get; set; }
        public DateTime LastMessageTimestamp { get; set; }
        public int NewMessagesCount { get; set; }
    }
}
