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
    class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        private ApplicationDBContext _context;

        public PhotoRepository(ApplicationDBContext context) : base(context)
        {
            _context = context;
        }

        public void Update(Photo updatedPhoto)
        {
            _context.Update(updatedPhoto);
        }
    }
}
