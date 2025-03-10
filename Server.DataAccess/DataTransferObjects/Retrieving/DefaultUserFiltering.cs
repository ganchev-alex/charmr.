using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Retrieving
{
    public class DefaultUserFiltering
    {
        public int LocationRadius { get; set; } = 30;
        public string Gender { get; set; } = string.Empty;
        public int[] AgeRange { get; set; } = [1, 50];
    }
}
