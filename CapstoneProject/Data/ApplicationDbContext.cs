﻿using System;
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

        DbSet<Route> Routes { get; set; }
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