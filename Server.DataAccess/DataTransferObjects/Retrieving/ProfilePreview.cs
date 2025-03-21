using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Retrieving
{
    public class ProfilePreview
    {
        public string FullName { get; set; }
        public string KnownAs { get; set; }
        public string About { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Sexuality { get; set; }
        public string LocationNormalized { get; set; }
        public List<string> Interests { get; set; }
        public PhotoDetails ProfilePicture { get; set; }
        public List<PhotoDetails> Gallery { get; set; }
    }
}
