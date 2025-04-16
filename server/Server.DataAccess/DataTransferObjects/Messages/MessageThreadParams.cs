using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Messages
{
    public class MessageThreadParams
    {
        public Guid InterlocutorId { get; set; }
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
    }
}
