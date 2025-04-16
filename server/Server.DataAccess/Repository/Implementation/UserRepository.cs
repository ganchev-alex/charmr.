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
    public class UserRepository : Repository<User>, IUserRepository
    {
        private ApplicationDBContext _context;
        public UserRepository(ApplicationDBContext context) : base(context)
        {
            this._context = context;
        }

        public void Update(User user, string email)
        {
            user.Email = email;
            _context.Users.Update(user);
        }
    }
}
