using Server.DataAccess.Database;
using Server.DataAccess.Repository.Abstraction;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.Repository.Implementation
{
    public class DetailsRepository : Repository<Details>, IDetailsRepository 
    {
        private ApplicationDBContext _context;

        public DetailsRepository(ApplicationDBContext context) : base(context)
        {
            _context = context;
        }

        public void Update(Details updatedDetails)
        {
            _context.Details.Update(updatedDetails);
        }
    }
}
