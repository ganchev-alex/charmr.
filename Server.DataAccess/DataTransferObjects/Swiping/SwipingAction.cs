using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.DataTransferObjects.Swiping
{
    public class SwipingAction
    {
        public string ActionType { get; set; } = string.Empty;
        public string LikedId { get; set; } = string.Empty;
    }
}
