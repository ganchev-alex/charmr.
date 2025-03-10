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
    public class MatchRepository : Repository<Match>, IMatchRepository
    {
        private readonly ApplicationDBContext _context;

        public MatchRepository(ApplicationDBContext context) : base (context)
        {
            _context = context;
        }
    }
}
