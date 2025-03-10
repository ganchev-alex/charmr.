using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Match
    {
        public Guid Id { get; set; }
        public Guid UserAId { get; set; }
        public User UserA { get; set; }
   
        public Guid UserBId { get; set; }
        public User UserB { get; set; }
    }

}
