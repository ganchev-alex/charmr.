using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public Details Details { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<Like> LikesGiven { get; set; } = new List<Like>();
        public ICollection<Like> LikesReceived { get; set; } = new List<Like>();

        public ICollection<Match> MatchesAsUserA { get; set; } = new List<Match>();
        public ICollection<Match> MatchesAsUserB { get; set; } = new List<Match>();

    }
}
