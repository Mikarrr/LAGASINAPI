using LagasinAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LagasinAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            string connectionString = "Data Source=LAPTOP-PJD4BVFJ;Initial Catalog=userdb;Integrated Security=True";

            optionsBuilder.UseSqlServer(connectionString);
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
    }
}
