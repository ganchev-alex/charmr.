using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.DataAccess.Database
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }


    }
}
