using Server.DataAccess.Database;
using Server.DataAccess.Repository.Abstraction;
using Server.DataAccess.Repository.Implementation;

namespace Server.DataAccess.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private ApplicationDBContext _context;
        public IUserRepository userRepository { get; private set; }
        public IDetailsRepository detailsRepository { get; private set; }
        public IPhotoRepository photoRepository { get; private set; }
        public ILikeRepository likeRepository { get; private set; }
        public IMatchRepository matchRepository { get; private set; }
        public IMessageRepository messageRepository { get; private set; }
        public IConnectionRepository connectionRepository { get; private set; }
        public IGroupRepository groupRepository { get; private set; }

        public UnitOfWork(ApplicationDBContext context) {
            this._context = context;
            this.userRepository = new UserRepository(context);
            this.detailsRepository = new DetailsRepository(context);
            this.photoRepository = new PhotoRepository(context);
            this.likeRepository = new LikeRepository(context);
            this.matchRepository = new MatchRepository(context);
            this.messageRepository = new MessageRepository(context);
            this.connectionRepository = new ConnectionRepository(context);
            this.groupRepository = new GroupRepository(context);
        }

        public async Task SaveTransaction()
        {
            await this._context.SaveChangesAsync();
        }        
    }
}

