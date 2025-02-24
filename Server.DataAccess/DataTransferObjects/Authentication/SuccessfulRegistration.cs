using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Authentication
{
    public class SuccessfulRegistration
    {
        public Guid userId { get; set; }
        public string token { get; set; }
    }
}
