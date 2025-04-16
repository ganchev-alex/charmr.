using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Like
    {
        public Guid Id { get; set; }

        // The use gives the likes to another.
        public Guid LikerId { get; set; }
        public User Liker { get; set; }
        
        // The user being liked.
        public Guid LikedId { get; set; }
        public User Liked { get; set; }

        public bool isSuperLike { get; set; }
        public DateTime likedOn { get; set; } = DateTime.UtcNow;
    }
}
