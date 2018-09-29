using System;
using System.Collections.Generic;
using System.Text;
using CapstoneProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace IntegrationProject.Data
{
    public class ApplicationDbContext : DbContext
    {
       public DbSet<User> Users { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<GroupMember> GroupMembers { get; set; }

        public DbSet<Route> Routes { get; set; }

        public DbSet<RouteCoordinate> RouteCoordinates { get; set; } 
        public DbSet<RouteDistance> RouteDistances { get; set; }
        public DbSet<RouteElevation> RouteElevations { get; set; }

        public DbSet<PathComment> PathComments { get; set; }

        public DbSet<PointComment> PointComments { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
        
    }
}