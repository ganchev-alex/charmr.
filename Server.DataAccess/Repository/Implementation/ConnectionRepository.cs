using Microsoft.EntityFrameworkCore;
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
    class ConnectionRepository : Repository<Connection>, IConnectionRepository
    {
        private readonly ApplicationDBContext _context;

        public ConnectionRepository(ApplicationDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Group?> GetGroupForConnection(string connectionIndentifier)
        {
            return await _context.Groups
                        .Include(c => c.Connections)
                        .Where(c => c.Connections.Any(x => x.ConnectionId == connectionIndentifier))
                        .FirstOrDefaultAsync();
        }
    }
}
