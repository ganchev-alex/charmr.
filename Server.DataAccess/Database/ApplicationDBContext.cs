using Microsoft.EntityFrameworkCore;
using Server.Models;
using System.Text.Json;

namespace Server.DataAccess.Database
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Details> Details { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Details>()
                .Property(d => d.Interests)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>()
                );

            modelBuilder.Entity<Like>()
                .HasOne(like => like.Liker)
                .WithMany(liker => liker.LikesGiven)
                .HasForeignKey(like => like.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>()
                .HasOne(like => like.Liked)
                .WithMany(liked => liked.LikesReceived)
                .HasForeignKey(like => like.LikedId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(match => match.UserA)
                .WithMany(userA => userA.MatchesAsUserA)
                .HasForeignKey(match => match.UserAId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(match => match.UserB)
                .WithMany(userB => userB.MatchesAsUserB)
                .HasForeignKey(match => match.UserBId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasIndex(match => new { match.UserAId, match.UserBId })
                .IsUnique();

            modelBuilder.Entity<Message>()
                .HasOne(message => message.Sender)
                .WithMany(user => user.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(message => message.Recipient)
                .WithMany(user => user.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Group>()
                .HasMany(g => g.Connections) 
                .WithOne(c => c.Group)      
                .HasForeignKey(c => c.GroupIdentifier)
                .IsRequired();
        }

    }
}
