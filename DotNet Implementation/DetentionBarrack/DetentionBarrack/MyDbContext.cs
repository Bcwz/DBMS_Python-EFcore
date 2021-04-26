using System.Reflection;
using Microsoft.EntityFrameworkCore;
using DetentionBarrackSetup.Data;

namespace DetentionBarrack
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<OperationState> OperationStates { get; set; }
        public DbSet<FileVersion> FileVersions { get; set; }
        public DbSet<FileChunkDevice> FileChunkDevices { get; set; }
        public DbSet<FileChunk> FileChunks { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Disk> Disks { get; set; }
        public DbSet<AccessLog> AccessLogs { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlite("Filename=../CoreDatabase.db", options =>
            //{
            //    options.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            //});
            string connectionString = $"Host=localhost;Username=admin;Password=123454321;Database=detentionBarracks;";
            optionsBuilder.UseMySQL(connectionString, option =>
            {
                option.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            });
            base.OnConfiguring(optionsBuilder);
        }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Add your models here
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Permission>().ToTable("Permissions");
            modelBuilder.Entity<OperationState>().ToTable("OperationStates");
            modelBuilder.Entity<FileVersion>().ToTable("FileVersions");
            modelBuilder.Entity<FileChunkDevice>().ToTable("FileChunkDevices");
            modelBuilder.Entity<FileChunk>().ToTable("FileChunks");
            modelBuilder.Entity<File>().ToTable("Files");
            modelBuilder.Entity<Device>().ToTable("Devices");
            modelBuilder.Entity<Disk>().ToTable("Disks");
            modelBuilder.Entity<AccessLog>().ToTable("AccessLogs");

            modelBuilder.UseIdentityColumns();
        }
    }
}
