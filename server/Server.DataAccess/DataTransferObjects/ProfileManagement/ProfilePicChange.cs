using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.ProfileManagement
{
    public class ProfilePicChange
    {
        public Guid currentId { get; set; }
        public Guid newId { get; set; }
    }
}
