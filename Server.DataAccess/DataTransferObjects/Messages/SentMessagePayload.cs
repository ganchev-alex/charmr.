using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Messages
{
    public class SentMessagePayload
    {
        public Guid RecipientId { get; set; }

        public string MessageContent { get; set; }
    }
}
