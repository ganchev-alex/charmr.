using Server.Models.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Swiping
{
    public class DeckFiltering
    {
        [Range(20,150)]
        public int LocationRadius { get; set; }
        public string Gender { get; set; } = string.Empty;
        [Length(2, 2)]
        public int[] AgeRange { get; set; } = [1, 50];
    }
}
