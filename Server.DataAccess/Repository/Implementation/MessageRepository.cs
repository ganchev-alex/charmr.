using Microsoft.EntityFrameworkCore;
using Server.DataAccess.Database;
using Server.DataAccess.Repository.Abstraction;
using Server.Models;

namespace Server.DataAccess.Repository.Implementation
{
    class MessageRepository : Repository<Message>, IMessageRepository
    {
        private readonly ApplicationDBContext _context;

        public MessageRepository(ApplicationDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessageThread(Guid coreInterlocutor, Guid otherInterlocutor, int pageIndex, int pageSize)
        {
            return await _context.Messages
                    .Where(m => (m.SenderId == coreInterlocutor && m.RecipientId == otherInterlocutor) ||
                                (m.SenderId == otherInterlocutor && m.RecipientId == coreInterlocutor))
                    .OrderByDescending(m => m.MessageSent)
                    .Skip((pageIndex - 1) * pageSize)      
                    .Take(pageSize)                       
                    .ToListAsync();
        }

        public void Update(Message message)
        {
            _context.Update(message);
        }
    }
}
