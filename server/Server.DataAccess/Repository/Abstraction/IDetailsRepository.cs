using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.Repository.Abstraction
{
    public interface IDetailsRepository : IRepository<Details>
    {
        public void Update(Details updatedDetails);
    }
}
