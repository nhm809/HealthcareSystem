using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.data {

    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Appointment> Appointments { get; set; }

        public virtual DbSet<Blog> Blogs { get; set; }

        public virtual DbSet<BlogImage> BlogImages { get; set; }

        public virtual DbSet<BlogView> BlogViews { get; set; }

        public virtual DbSet<Feedback> Feedbacks { get; set; }

        public virtual DbSet<Invoice> Invoices { get; set; }

        public virtual DbSet<QuestionThreadItem> QuestionThreadItems { get; set; }

        public virtual DbSet<Notification> Notifications { get; set; }

        public virtual DbSet<OtpRequest> OtpRequests { get; set; }

        public virtual DbSet<Question> Questions { get; set; }

        public virtual DbSet<ReportServiceDetail> ReportServiceDetails { get; set; }

        public virtual DbSet<ReproductiveCycle> ReproductiveCycles { get; set; }

        public virtual DbSet<Role> Roles { get; set; }

        public virtual DbSet<Service> Services { get; set; }

        public virtual DbSet<Specialty> Specialties { get; set; }

        public virtual DbSet<TestServiceRecord> TestServiceRecords { get; set; }

        public virtual DbSet<User> Users { get; set; }

        // public virtual DbSet<WorkSchedule> WorkSchedules { get; set; }

        public virtual DbSet<WeeklySchedule> WeeklySchedules { get; set; }

        public virtual DbSet<WeeklyOverrideSchedule> WeeklyOverrideSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA2D172AD9E");

                entity.ToTable("Appointment");

                entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.EndTime).HasColumnType("datetime");
                entity.Property(e => e.MeetLink)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.StartTime).HasColumnType("datetime");
                entity.Property(e => e.Status).HasMaxLength(20);

                entity.HasOne(d => d.Consultant).WithMany(p => p.AppointmentConsultants)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Appointme__Consu__3F466844");

                entity.HasOne(d => d.Member).WithMany(p => p.AppointmentMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Appointme__Membe__3D5E1FD2");

                entity.HasOne(d => d.Service).WithMany(p => p.Appointments)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__Appointme__Servi__3E52440B");
            });

            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(e => e.BlogId).HasName("PK__Blog__54379E5044619794");

                entity.ToTable("Blog");

                entity.Property(e => e.BlogId).HasColumnName("BlogID");
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.Property(e => e.Topic).HasMaxLength(50);

                entity.HasOne(d => d.Consultant).WithMany(p => p.Blogs)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Blog__Consultant__34C8D9D1");
            });

            modelBuilder.Entity<BlogImage>(entity =>
            {
                entity.HasKey(e => e.ImageId).HasName("PK__BlogImag__7516F4EC111C0B4F");

                entity.ToTable("BlogImage");

                entity.Property(e => e.ImageId).HasColumnName("ImageID");
                entity.Property(e => e.BlogId).HasColumnName("BlogID");
                entity.Property(e => e.ImageCaption).HasMaxLength(200);
                entity.Property(e => e.ImagePath)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.UploadDate).HasColumnType("datetime");

                entity.HasOne(d => d.Blog).WithMany(p => p.BlogImages)
                    .HasForeignKey(d => d.BlogId)
                    .HasConstraintName("FK__BlogImage__BlogI__59063A47");
            });

            modelBuilder.Entity<BlogView>(entity =>
            {
                entity.HasKey(e => e.BlogViewId).HasName("PK__BlogView__5A5F0B6CFF67BCB5");

                entity.ToTable("BlogView");

                entity.Property(e => e.BlogViewId).HasColumnName("BlogViewID");
                entity.Property(e => e.BlogId).HasColumnName("BlogID");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.ViewDate).HasColumnType("datetime");

                entity.HasOne(d => d.Blog).WithMany(p => p.BlogViews)
                    .HasForeignKey(d => d.BlogId)
                    .HasConstraintName("FK__BlogView__BlogID__5CD6CB2B");

                entity.HasOne(d => d.Member).WithMany(p => p.BlogViews)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__BlogView__Member__5BE2A6F2");
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF62A9CAF58");

                entity.ToTable("Feedback");

                entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
                entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
                entity.Property(e => e.FeedbackDate)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.RecordId).HasColumnName("RecordID");

                entity.HasOne(d => d.Appointment).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK__Feedback__Appoin__656C112C");

                entity.HasOne(d => d.Record).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.RecordId)
                    .HasConstraintName("FK__Feedback__Record__66603565");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceId).HasName("PK__Invoice__D796AAD50B806764");

                entity.ToTable("Invoice");

                entity.Property(e => e.InvoiceId).HasColumnName("InvoiceID");
                entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.TaxRate).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.TestServiceRecordId).HasColumnName("TestServiceRecordID");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.UnitPrice)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.HasOne(d => d.Appointment).WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK__Invoice__Appoint__5441852A");


                entity.HasOne(d => d.TestServiceRecord).WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.TestServiceRecordId)
                    .HasConstraintName("FK__Invoice__TestSer__5535A963");
            });

            modelBuilder.Entity<QuestionThreadItem>(entity =>
            {
                entity.HasKey(e => e.ThreadItemId).HasName("PK__QuestionThreadItem");

                entity.ToTable("QuestionThreadItem");

                entity.Property(e => e.ThreadItemId).HasColumnName("ThreadItemID");
                entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
                entity.Property(e => e.SentAt).HasColumnType("datetime");
                entity.Property(e => e.AnsweredAt).HasColumnType("datetime");
                entity.Property(e => e.QuestionText).HasColumnType("nvarchar(max)");
                entity.Property(e => e.AnswerText).HasColumnType("nvarchar(max)");
                entity.Property(e => e.AttachmentPath).HasMaxLength(255);
                entity.Property(e => e.IsAnswered);

                entity.HasOne(d => d.Question)
                    .WithMany(p => p.QuestionThreadItems)
                    .HasForeignKey(d => d.QuestionId)
                    .HasConstraintName("FK__QuestionThreadItem__Question");
            });


            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E325DAFA885");

                entity.ToTable("Notification");

                entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
                entity.Property(e => e.Content).HasColumnType("nvarchar(max)");
                entity.Property(e => e.SendTime).HasColumnType("datetime");
                entity.Property(e => e.IsRead).HasColumnName("IsRead");
                entity.Property(e => e.Title).HasMaxLength(50);
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Notificat__UserI__4BAC3F29");
            });

            modelBuilder.Entity<OtpRequest>(entity =>
            {
                entity.HasKey(e => e.OtpId).HasName("PK__OTPReque__5C2EC562B070925E");

                entity.ToTable("OTPRequest");

                entity.Property(e => e.OtpId).HasColumnName("OTPID");
                entity.Property(e => e.Code)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.ExpiredAt).HasColumnType("datetime");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.OtpRequests)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__OTPReques__UserI__48CFD27E");
            });


            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8C7085B3FF");

                entity.ToTable("Question");

                entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
                entity.Property(e => e.AttachmentPath).HasMaxLength(200);
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.SpecialtyId).HasColumnName("SpecialtyId");
                entity.Property(e => e.Status).HasColumnType("nvarchar(100)");
                entity.Property(e => e.SubmitDate).HasColumnType("datetime");
                entity.Property(e => e.TitleQuestion).HasMaxLength(200);

                entity.HasOne(d => d.Consultant).WithMany(p => p.QuestionConsultants)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Question__Consul__45F365D3");

                entity.HasOne(d => d.Member).WithMany(p => p.QuestionMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Question__Member__44FF419A");
            });

            modelBuilder.Entity<ReportServiceDetail>(entity =>
            {
                entity.HasKey(e => e.ReportServiceId).HasName("PK__ReportSe__EBE898635120F25D");

                entity.ToTable("ReportServiceDetail");

                entity.Property(e => e.ReportServiceId).HasColumnName("ReportServiceID");
                entity.Property(e => e.AvgRating).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ReportPeriod).HasMaxLength(20);
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.TotalRevenue).HasColumnType("decimal(10, 2)");

                entity.HasOne(d => d.Service).WithMany(p => p.ReportServiceDetails)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__ReportSer__Servi__4222D4EF");
            });

            modelBuilder.Entity<ReproductiveCycle>(entity =>
            {
                entity.HasKey(e => e.CycleId).HasName("PK__Reproduc__077B24D97C9AA5A6");

                entity.ToTable("ReproductiveCycle");

                entity.Property(e => e.CycleId).HasColumnName("CycleID");
                entity.Property(e => e.LastUpdated).HasColumnType("datetime");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");

                entity.HasOne(d => d.Member).WithMany(p => p.ReproductiveCycles)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Reproduct__Membe__2F10007B");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3A872501E5");

                entity.ToTable("Role");

                entity.Property(e => e.RoleId)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("RoleID");
                entity.Property(e => e.RoleDescription).HasMaxLength(255);
                entity.Property(e => e.RoleName).HasMaxLength(100);
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EA63AB2E89");

                entity.ToTable("Service");

                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            });

            modelBuilder.Entity<Specialty>(entity =>
            {
                entity.HasKey(e => e.SpecialtyId).HasName("PK__Specialt__D768F6489A0BBC10");

                entity.ToTable("Specialty");

                entity.Property(e => e.SpecialtyId).HasColumnName("SpecialtyID");
                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<TestServiceRecord>(entity =>
            {
                entity.HasKey(e => e.TestServiceRecordId).HasName("PK__TestServ__F810175D4779B45B");

                entity.ToTable("TestServiceRecord");

                entity.Property(e => e.TestServiceRecordId).HasColumnName("TestServiceRecordID");
                entity.Property(e => e.FullNameOfMember).HasMaxLength(100);
                entity.Property(e => e.Gender)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.Notes).HasMaxLength(100);
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.RecordDate).HasColumnType("datetime");
                entity.Property(e => e.Result).HasMaxLength(100);
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.StaffId).HasColumnName("StaffID");
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Member).WithMany(p => p.TestServiceRecordMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__TestServi__Membe__398D8EEE");

                entity.HasOne(d => d.Service).WithMany(p => p.TestServiceRecords)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__TestServi__Servi__38996AB5");

                entity.HasOne(d => d.Staff).WithMany(p => p.TestServiceRecordStaffs)
                    .HasForeignKey(d => d.StaffId)
                    .HasConstraintName("FK__TestServi__Staff__3A81B327");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__User__1788CCAC907AF080");

                entity.ToTable("User");

                entity.Property(e => e.UserId).HasColumnName("UserID");
                entity.Property(e => e.Address).HasMaxLength(100);
                entity.Property(e => e.Avatar)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.FullName).HasMaxLength(50).IsRequired(false);
                entity.Property(e => e.Gender).HasMaxLength(15);
                entity.Property(e => e.PasswordHash)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.RoleId)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("RoleID");

                entity.HasOne(d => d.Role).WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK__User__RoleID__286302EC");

                entity.HasMany(d => d.Specialties).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "UserSpecialty",
                        r => r.HasOne<Specialty>().WithMany()
                            .HasForeignKey("SpecialtyId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__UserSpeci__Speci__4F7CD00D"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__UserSpeci__UserI__4E88ABD4"),
                        j =>
                        {
                            j.HasKey("UserId", "SpecialtyId").HasName("PK__UserSpec__8AFE43C8943BFACE");
                            j.ToTable("UserSpecialty");
                            j.IndexerProperty<int>("UserId").HasColumnName("UserID");
                            j.IndexerProperty<int>("SpecialtyId").HasColumnName("SpecialtyID");
                        });
            });

            // modelBuilder.Entity<WorkSchedule>(entity =>
            // {
            //     entity.HasKey(e => e.WorkScheduleId).HasName("PK__WorkSche__C6AC635EDF22BB92");

            //     entity.ToTable("WorkSchedule");

            //     entity.Property(e => e.WorkScheduleId).HasColumnName("WorkScheduleID");
            //     entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
            //     entity.Property(e => e.Note).HasMaxLength(100);
            //     entity.Property(e => e.ShiftType).HasMaxLength(50);

            //     entity.HasOne(d => d.Consultant).WithMany(p => p.WorkSchedules)
            //         .HasForeignKey(d => d.ConsultantId)
            //         .HasConstraintName("FK__WorkSched__Consu__31EC6D26");
            // });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}