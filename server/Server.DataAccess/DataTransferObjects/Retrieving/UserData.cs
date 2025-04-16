using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Retrieving
{
    public class UserCredentials
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public bool VerificationStatus { get; set; }
    }

    public class UserDetails
    {
        public string KnownAs { get; set; }
        public string About { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Sexuality { get; set; }
        public string LocationNormalized { get; set; }
        public List<string> Interests { get; set; }
    }

    public class PhotoDetails
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
    }

    public class UserData
    {
        public UserCredentials Credentials { get; set; } = new UserCredentials();
        public UserDetails Details { get; set; } = new UserDetails();
        public PhotoDetails ProfilePicture { get; set; }
        public List<PhotoDetails> Gallery { get; set; }
    }
}
