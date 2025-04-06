using Microsoft.EntityFrameworkCore;
using Server.DataAccess.Database;
using Server.DataAccess.Repository.Abstraction;
using Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Server.DataAccess.Repository.Implementation
{
    class GroupRepository : Repository<Group>, IGroupRepository
    {
        private readonly ApplicationDBContext _context;

        public GroupRepository(ApplicationDBContext context) : base(context)
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
