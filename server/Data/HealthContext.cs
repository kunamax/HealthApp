using Microsoft.EntityFrameworkCore;
using HealthApp.Models;

namespace HealthApp.Data
{
    public class HealthContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<DailyReport> DailyReports { get; set; }

        public string DbPath { get; }

        public HealthContext()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = Path.Join(path, "health.db");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DailyReport>()
                .HasOne(d => d.User)
                .WithMany(u => u.DailyReports)
                .HasForeignKey(d => d.UserId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
