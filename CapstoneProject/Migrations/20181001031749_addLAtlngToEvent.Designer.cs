﻿// <auto-generated />
using System;
using IntegrationProject.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CapstoneProject.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20181001031749_addLAtlngToEvent")]
    partial class addLAtlngToEvent
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.3-rtm-32065")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("CapstoneProject.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Description");

                    b.Property<string>("LatitudeStart");

                    b.Property<string>("LongitudeStart");

                    b.Property<string>("Name");

                    b.Property<DateTime>("Time");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("CapstoneProject.Models.EventRoute", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Details");

                    b.Property<int>("EventId");

                    b.Property<int>("RouteId");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.HasIndex("RouteId");

                    b.ToTable("EventRoutes");
                });

            modelBuilder.Entity("CapstoneProject.Models.Group", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("City");

                    b.Property<string>("Description");

                    b.Property<string>("Latitude");

                    b.Property<string>("Longitude");

                    b.Property<string>("Name");

                    b.Property<string>("State");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("CapstoneProject.Models.GroupMember", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("GroupId");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("UserId");

                    b.ToTable("GroupMembers");
                });

            modelBuilder.Entity("CapstoneProject.Models.Invite", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("EventId");

                    b.Property<bool>("Going");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.HasIndex("UserId");

                    b.ToTable("Invites");
                });

            modelBuilder.Entity("CapstoneProject.Models.PathComment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Latitude1");

                    b.Property<string>("Latitude2");

                    b.Property<string>("Longitude1");

                    b.Property<string>("Longitude2");

                    b.Property<string>("Note");

                    b.Property<int>("RouteId");

                    b.Property<int>("UserId");

                    b.Property<string>("Writer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.HasIndex("UserId");

                    b.ToTable("PathComments");
                });

            modelBuilder.Entity("CapstoneProject.Models.PointComment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Latitude");

                    b.Property<string>("Longitude");

                    b.Property<string>("Note");

                    b.Property<int>("RouteId");

                    b.Property<int>("UserId");

                    b.Property<string>("Writer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.HasIndex("UserId");

                    b.ToTable("PointComments");
                });

            modelBuilder.Entity("CapstoneProject.Models.Route", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("City");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<string>("State");

                    b.Property<string>("TotalDistance");

                    b.Property<string>("TotalElevationGain");

                    b.Property<string>("TotalElevationLoss");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Routes");
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteCoordinate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Latitude");

                    b.Property<string>("Longitude");

                    b.Property<int>("RouteId");

                    b.Property<int>("SortOrder");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("RouteCoordinates");
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteDistance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Distance");

                    b.Property<int>("RouteId");

                    b.Property<int>("SortOrder");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("RouteDistances");
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteElevation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Down");

                    b.Property<int>("RouteId");

                    b.Property<int>("SortOrder");

                    b.Property<string>("Up");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("RouteElevations");
                });

            modelBuilder.Entity("CapstoneProject.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("City");

                    b.Property<string>("Email");

                    b.Property<string>("FirstName");

                    b.Property<string>("HashedPassword");

                    b.Property<string>("LastName");

                    b.Property<string>("Latitude");

                    b.Property<string>("Longitude");

                    b.Property<string>("State");

                    b.Property<string>("StravaAccessTokenHashed");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CapstoneProject.Models.Event", b =>
                {
                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.EventRoute", b =>
                {
                    b.HasOne("CapstoneProject.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.Group", b =>
                {
                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.GroupMember", b =>
                {
                    b.HasOne("CapstoneProject.Models.Group", "Group")
                        .WithMany()
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.Invite", b =>
                {
                    b.HasOne("CapstoneProject.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.PathComment", b =>
                {
                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.PointComment", b =>
                {
                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.Route", b =>
                {
                    b.HasOne("CapstoneProject.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteCoordinate", b =>
                {
                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteDistance", b =>
                {
                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CapstoneProject.Models.RouteElevation", b =>
                {
                    b.HasOne("CapstoneProject.Models.Route", "Route")
                        .WithMany()
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
