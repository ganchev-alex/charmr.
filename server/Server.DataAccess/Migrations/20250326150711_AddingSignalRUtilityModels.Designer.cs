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
    [Migration("20250326150711_AddingSignalRUtilityModels")]
    partial class AddingSignalRUtilityModels
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.2");

            modelBuilder.Entity("Server.Models.Connection", b =>
                {
                    b.Property<string>("ConnectionId")
                        .HasColumnType("TEXT");

                    b.Property<string>("GroupIdentifier")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("ConnectionId");

                    b.HasIndex("GroupIdentifier");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Server.Models.Details", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("About")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("BirthYear")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Interests")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("KnownAs")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("Latitude")
                        .HasColumnType("REAL");

                    b.Property<string>("LocationNormalized")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("Longitude")
                        .HasColumnType("REAL");

                    b.Property<string>("Sexuality")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("VerificationStatus")
                        .HasColumnType("INTEGER");

                    b.HasKey("UserId");

                    b.ToTable("Details");
                });

            modelBuilder.Entity("Server.Models.Group", b =>
                {
                    b.Property<string>("Identifier")
                        .HasColumnType("TEXT");

                    b.HasKey("Identifier");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("Server.Models.Like", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("LikedId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("LikerId")
                        .HasColumnType("TEXT");

                    b.Property<bool>("isSuperLike")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("likedOn")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("LikedId");

                    b.HasIndex("LikerId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("Server.Models.Match", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserAId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserBId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("UserBId");

                    b.HasIndex("UserAId", "UserBId")
                        .IsUnique();

                    b.ToTable("Matches");
                });

            modelBuilder.Entity("Server.Models.Message", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DateRead")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeletedBySender")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("MessageSent")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("RecipientId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("SenderId")
                        .HasColumnType("TEXT");

                    b.Property<bool>("isRead")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("RecipientId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("Server.Models.Photo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("PublicId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<bool>("isMain")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Photo");
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

            modelBuilder.Entity("Server.Models.Connection", b =>
                {
                    b.HasOne("Server.Models.Group", null)
                        .WithMany("Connections")
                        .HasForeignKey("GroupIdentifier");
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

            modelBuilder.Entity("Server.Models.Like", b =>
                {
                    b.HasOne("Server.Models.User", "Liked")
                        .WithMany("LikesReceived")
                        .HasForeignKey("LikedId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Server.Models.User", "Liker")
                        .WithMany("LikesGiven")
                        .HasForeignKey("LikerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Liked");

                    b.Navigation("Liker");
                });

            modelBuilder.Entity("Server.Models.Match", b =>
                {
                    b.HasOne("Server.Models.User", "UserA")
                        .WithMany("MatchesAsUserA")
                        .HasForeignKey("UserAId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Server.Models.User", "UserB")
                        .WithMany("MatchesAsUserB")
                        .HasForeignKey("UserBId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserA");

                    b.Navigation("UserB");
                });

            modelBuilder.Entity("Server.Models.Message", b =>
                {
                    b.HasOne("Server.Models.User", "Recipient")
                        .WithMany("MessagesReceived")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Server.Models.User", "Sender")
                        .WithMany("MessagesSent")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Recipient");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("Server.Models.Photo", b =>
                {
                    b.HasOne("Server.Models.User", "User")
                        .WithMany("Photos")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Server.Models.Group", b =>
                {
                    b.Navigation("Connections");
                });

            modelBuilder.Entity("Server.Models.User", b =>
                {
                    b.Navigation("Details")
                        .IsRequired();

                    b.Navigation("LikesGiven");

                    b.Navigation("LikesReceived");

                    b.Navigation("MatchesAsUserA");

                    b.Navigation("MatchesAsUserB");

                    b.Navigation("MessagesReceived");

                    b.Navigation("MessagesSent");

                    b.Navigation("Photos");
                });
#pragma warning restore 612, 618
        }
    }
}
