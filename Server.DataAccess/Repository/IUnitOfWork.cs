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
        public IDetailsRepository detailsRepository { get; }
        public IPhotoRepository photoRepository { get; }
        public ILikeRepository likeRepository { get; }
        public IMatchRepository matchRepository { get; }

        public Task SaveTransaction();
    }
}
