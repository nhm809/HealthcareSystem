using Microsoft.EntityFrameworkCore;

namespace HealthcareSystem.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        private const string connectionString = @"
            Server=localhost;
            Database=GenderHealthDatabase;
            User Id=sa;
            Password=your_password;
            TrustServerCertificate=True;";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(connectionString);
        }

        //// Ví dụ DbSet
        //public DbSet<User> Users { get; set; }
    }
}
