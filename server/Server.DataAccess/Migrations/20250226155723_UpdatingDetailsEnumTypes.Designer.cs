﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.DataAccess.Database;

#nullable disable

namespace Server.DataAccess.Migrations
{
    [DbContext(typeof(ApplicationDBContext))]
    [Migration("20250226155723_UpdatingDetailsEnumTypes")]
    partial class UpdatingDetailsEnumTypes
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.2");

            modelBuilder.Entity("Server.Models.Details", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("About")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<byte>("BirthYear")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Interests")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("KnownAs")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SelectedLocation")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Sexuality")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("VerificationStatus")
                        .HasColumnType("INTEGER");

                    b.HasKey("UserId");

                    b.ToTable("Details");
                });

            modelBuilder.Entity("Server.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Server.Models.Details", b =>
                {
                    b.HasOne("Server.Models.User", "User")
                        .WithOne("Details")
                        .HasForeignKey("Server.Models.Details", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Server.Models.User", b =>
                {
                    b.Navigation("Details")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
