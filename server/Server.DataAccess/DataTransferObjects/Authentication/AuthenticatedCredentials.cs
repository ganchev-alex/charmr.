using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Authentication
{
    public class AuthenticatedCredentials
    {
        public required Guid userId { get; set; }
        public required string token { get; set; }
    }
}
