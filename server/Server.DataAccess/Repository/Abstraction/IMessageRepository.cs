using Server.DataAccess.DataTransferObjects.Messages;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.Repository.Abstraction
{
    public interface IMessageRepository: IRepository<Message>
    {
        public Task<IEnumerable<Message>> GetMessageThread(Guid coreInterlocutor, Guid otherInterlocutor, int pageIndex, int pageSize);

        public void Update(Message message);
    }
}
