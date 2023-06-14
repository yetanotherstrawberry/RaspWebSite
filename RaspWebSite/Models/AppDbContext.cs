using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace RaspWebSite.Models
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Visitor>()
                .HasIndex(entity => entity.IP)
                .IsUnique();

            modelBuilder.Entity<Visitor>()
                .HasIndex(entity => entity.LastVisit);

            modelBuilder.Entity<Entry>()
                .HasMany(entity => entity.Tags)
                .WithMany();
        }

        public DbSet<Visitor> Visitors { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Entry> Entries { get; set; }

    }
}
