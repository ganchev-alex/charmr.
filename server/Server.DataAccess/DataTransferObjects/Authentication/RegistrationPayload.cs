using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Authentication
{
    public class RegistrationPayload
    {
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Your full name is required.")]
        public required string fullName { get; set; }
        [EmailAddress(ErrorMessage = "Invalid email format. Please enter a valid email address.")]
        public required string email { get; set; }
        [StringLength(50, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
        public required string password { get; set; }
        
    }
}
