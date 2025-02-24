using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Authentication
{
    public class RegistrationPayload
    {
        public string fullName { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        
    }
}
