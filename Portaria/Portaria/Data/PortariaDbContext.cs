using Microsoft.EntityFrameworkCore;
using Portaria.Models;

namespace Portaria.Data
{
    public class PortariaDbContext : DbContext
    {
        public PortariaDbContext(DbContextOptions<PortariaDbContext> options) : base(options) { }

        public DbSet<Pessoa> Pessoa { get; set; }
        public DbSet<Funcionario> Funcionario { get; set; }
        public DbSet<Visitante> Visitante { get; set; }
        public DbSet<Terceiro> Terceiro { get; set; }
        public DbSet<Veiculo> Veiculo { get; set; }
        public DbSet<Acesso> Acesso { get; set; }
        public DbSet<Local> Local { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pessoa>()
                .ToTable("Pessoa");

            modelBuilder.Entity<Funcionario>()
                .ToTable("Funcionario")
                .HasBaseType<Pessoa>();

            modelBuilder.Entity<Visitante>()
                .ToTable("Visitante")
                .HasBaseType<Pessoa>();

            modelBuilder.Entity<Terceiro>()
                .ToTable("Terceiro")
                .HasBaseType<Pessoa>();

            base.OnModelCreating(modelBuilder);
        }
    }
}