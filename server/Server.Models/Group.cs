using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Group
    {
        [Key]
        public string Identifier { get; set; }
        public ICollection<Connection> Connections { get; set; } = new List<Connection>();

        public Group() { }
        public Group(string identifier)
        {
            Identifier = identifier;
        }
    }
}
