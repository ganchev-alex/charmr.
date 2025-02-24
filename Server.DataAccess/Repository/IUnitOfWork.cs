using Server.DataAccess.Repository.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.Repository
{
    public interface IUnitOfWork
    {
        public IUserRepository userRepository { get; }

        public Task SaveTransaction();
    }
}
