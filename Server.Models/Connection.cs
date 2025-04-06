using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Connection
    {
        public string ConnectionId { get; set; }
        public Guid UserId { get; set; }
        public string GroupIdentifier { get; set; }
        public Group Group { get; set; }

        public Connection() { }
        public Connection(string connectionId, Guid userId)
        {
            ConnectionId = connectionId;
            UserId = userId;
        }
    }
}
