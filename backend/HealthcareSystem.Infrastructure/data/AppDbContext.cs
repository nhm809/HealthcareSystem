using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.data
{
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

        public virtual DbSet<Message> Messages { get; set; }

        public virtual DbSet<Notification> Notifications { get; set; }

        public virtual DbSet<Otprequest> Otprequests { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<Question> Questions { get; set; }

        public virtual DbSet<ReportServiceDetail> ReportServiceDetails { get; set; }

        public virtual DbSet<ReproductiveCycle> ReproductiveCycles { get; set; }

        public virtual DbSet<Role> Roles { get; set; }

        public virtual DbSet<Service> Services { get; set; }

        public virtual DbSet<Specialty> Specialties { get; set; }

        public virtual DbSet<TestServiceRecord> TestServiceRecords { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<WorkSchedule> WorkSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA2BFB38570");

                entity.ToTable("Appointment");

                entity.Property(e => e.AppointmentId)
                    .ValueGeneratedNever()
                    .HasColumnName("AppointmentID");
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.EndTime).HasColumnType("datetime");
                entity.Property(e => e.MeetLink)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.StartTime).HasColumnType("datetime");
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Consultant).WithMany(p => p.AppointmentConsultants)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Appointme__Consu__4AB81AF0");

                entity.HasOne(d => d.Member).WithMany(p => p.AppointmentMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Appointme__Membe__48CFD27E");

                entity.HasOne(d => d.Service).WithMany(p => p.Appointments)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__Appointme__Servi__49C3F6B7");
            });

            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(e => e.BlogId).HasName("PK__Blog__54379E504E59807F");

                entity.ToTable("Blog");

                entity.Property(e => e.BlogId)
                    .ValueGeneratedNever()
                    .HasColumnName("BlogID");
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.Content).HasColumnType("text");
                entity.Property(e => e.Description).HasColumnType("text");
                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.Topic)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Consultant).WithMany(p => p.Blogs)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Blog__Consultant__4E88ABD4");
            });

            modelBuilder.Entity<BlogImage>(entity =>
            {
                entity.HasKey(e => e.ImageId).HasName("PK__BlogImag__7516F4EC92482275");

                entity.ToTable("BlogImage");

                entity.Property(e => e.ImageId)
                    .ValueGeneratedNever()
                    .HasColumnName("ImageID");
                entity.Property(e => e.BlogId).HasColumnName("BlogID");
                entity.Property(e => e.ImageCaption)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.ImagePath)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.UploadDate).HasColumnType("datetime");

                entity.HasOne(d => d.Blog).WithMany(p => p.BlogImages)
                    .HasForeignKey(d => d.BlogId)
                    .HasConstraintName("FK__BlogImage__BlogI__5441852A");
            });

            modelBuilder.Entity<BlogView>(entity =>
            {
                entity.HasKey(e => e.BlogViewId).HasName("PK__BlogView__5A5F0B6C6ACA44F2");

                entity.ToTable("BlogView");

                entity.Property(e => e.BlogViewId)
                    .ValueGeneratedNever()
                    .HasColumnName("BlogViewID");
                entity.Property(e => e.BlogId).HasColumnName("BlogID");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.ViewDate).HasColumnType("datetime");

                entity.HasOne(d => d.Blog).WithMany(p => p.BlogViews)
                    .HasForeignKey(d => d.BlogId)
                    .HasConstraintName("FK__BlogView__BlogID__619B8048");

                entity.HasOne(d => d.Member).WithMany(p => p.BlogViews)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__BlogView__Member__60A75C0F");
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF6FFB87368");

                entity.ToTable("Feedback");

                entity.Property(e => e.FeedbackId)
                    .ValueGeneratedNever()
                    .HasColumnName("FeedbackID");
                entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
                entity.Property(e => e.Comment).HasColumnType("text");
                entity.Property(e => e.RecordId).HasColumnName("RecordID");

                entity.HasOne(d => d.Appointment).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK__Feedback__Appoin__4BAC3F29");

                entity.HasOne(d => d.Record).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.RecordId)
                    .HasConstraintName("FK__Feedback__Record__4CA06362");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceId).HasName("PK__Invoice__D796AAD56506E1C1");

                entity.ToTable("Invoice");

                entity.Property(e => e.InvoiceId)
                    .ValueGeneratedNever()
                    .HasColumnName("InvoiceID");
                entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
                entity.Property(e => e.TaxRate).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.TestServiceRecordId).HasColumnName("TestServiceRecordID");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");
                entity.Property(e => e.UnitPrice)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.HasOne(d => d.Appointment).WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.AppointmentId)
                    .HasConstraintName("FK__Invoice__Appoint__59063A47");

                entity.HasOne(d => d.TestServiceRecord).WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.TestServiceRecordId)
                    .HasConstraintName("FK__Invoice__TestSer__59FA5E80");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.MessageId).HasName("PK__Message__C87C037CF5DC5647");

                entity.ToTable("Message");

                entity.Property(e => e.MessageId)
                    .ValueGeneratedNever()
                    .HasColumnName("MessageID");
                entity.Property(e => e.Content).HasColumnType("text");
                entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
                entity.Property(e => e.SenderId).HasColumnName("SenderID");
                entity.Property(e => e.SentAt).HasColumnType("datetime");

                entity.HasOne(d => d.Question).WithMany(p => p.Messages)
                    .HasForeignKey(d => d.QuestionId)
                    .HasConstraintName("FK__Message__Questio__5BE2A6F2");

                entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
                    .HasForeignKey(d => d.SenderId)
                    .HasConstraintName("FK__Message__SenderI__5CD6CB2B");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E32C0C86861");

                entity.ToTable("Notification");

                entity.Property(e => e.NotificationId)
                    .ValueGeneratedNever()
                    .HasColumnName("NotificationID");
                entity.Property(e => e.Content).HasColumnType("text");
                entity.Property(e => e.SendTime).HasColumnType("datetime");
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.Type)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Notificat__UserI__52593CB8");
            });

            modelBuilder.Entity<Otprequest>(entity =>
            {
                entity.HasKey(e => e.Otpid).HasName("PK__OTPReque__5C2EC562635C7CC6");

                entity.ToTable("OTPRequest");

                entity.Property(e => e.Otpid)
                    .ValueGeneratedNever()
                    .HasColumnName("OTPID");
                entity.Property(e => e.Code)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.ExpiredAt).HasColumnType("datetime");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Otprequests)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__OTPReques__UserI__5AEE82B9");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId).HasName("PK__Payment__A0D9EFA6A68CA681");

                entity.ToTable("Payment");

                entity.Property(e => e.PaymentId)
                    .ValueGeneratedNever()
                    .HasColumnName("paymentID");
                entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.BankCode)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.PaidAt).HasColumnType("datetime");
                entity.Property(e => e.PaymentMethod)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.TransactionId)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("TransactionID");

                entity.HasOne(d => d.PaymentNavigation).WithOne(p => p.Payment)
                    .HasForeignKey<Payment>(d => d.PaymentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Payment__payment__5535A963");
            });

            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8CF017467D");

                entity.ToTable("Question");

                entity.Property(e => e.QuestionId)
                    .ValueGeneratedNever()
                    .HasColumnName("QuestionID");
                entity.Property(e => e.AttachmentPath)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.Content).HasColumnType("text");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.Specialty)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.SubmitDate).HasColumnType("datetime");
                entity.Property(e => e.TitleQuestion)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.Consultant).WithMany(p => p.QuestionConsultants)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__Question__Consul__5812160E");

                entity.HasOne(d => d.Member).WithMany(p => p.QuestionMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Question__Member__571DF1D5");
            });

            modelBuilder.Entity<ReportServiceDetail>(entity =>
            {
                entity.HasKey(e => e.ReportServiceId).HasName("PK__ReportSe__EBE89863234FCE03");

                entity.ToTable("ReportServiceDetail");

                entity.Property(e => e.ReportServiceId)
                    .ValueGeneratedNever()
                    .HasColumnName("ReportServiceID");
                entity.Property(e => e.AvgRating).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ReportPeriod)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.TotalRevenue).HasColumnType("decimal(10, 2)");

                entity.HasOne(d => d.Service).WithMany(p => p.ReportServiceDetails)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__ReportSer__Servi__5629CD9C");
            });

            modelBuilder.Entity<ReproductiveCycle>(entity =>
            {
                entity.HasKey(e => e.CycleId).HasName("PK__Reproduc__077B24D926B42B5A");

                entity.ToTable("ReproductiveCycle");

                entity.Property(e => e.CycleId)
                    .ValueGeneratedNever()
                    .HasColumnName("CycleID");
                entity.Property(e => e.LastUpdated).HasColumnType("datetime");
                entity.Property(e => e.MemberId).HasColumnName("MemberID");

                entity.HasOne(d => d.Member).WithMany(p => p.ReproductiveCycles)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__Reproduct__Membe__4D94879B");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3ABDFAAD38");

                entity.ToTable("Role");

                entity.Property(e => e.RoleId)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("RoleID");
                entity.Property(e => e.RoleName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Roles)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Role__UserID__5DCAEF64");
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EA16CB26C0");

                entity.ToTable("Service");

                entity.Property(e => e.ServiceId)
                    .ValueGeneratedNever()
                    .HasColumnName("ServiceID");
                entity.Property(e => e.Description).HasColumnType("text");
                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            });

            modelBuilder.Entity<Specialty>(entity =>
            {
                entity.HasKey(e => e.SpecialtyId).HasName("PK__Specialt__D768F64810D6E652");

                entity.ToTable("Specialty");

                entity.Property(e => e.SpecialtyId)
                    .ValueGeneratedNever()
                    .HasColumnName("SpecialtyID");
                entity.Property(e => e.Description).HasColumnType("text");
                entity.Property(e => e.Name)
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TestServiceRecord>(entity =>
            {
                entity.HasKey(e => e.TestServiceRecordId).HasName("PK__TestServ__F810175D2BBAD248");

                entity.ToTable("TestServiceRecord");

                entity.Property(e => e.TestServiceRecordId)
                    .ValueGeneratedNever()
                    .HasColumnName("TestServiceRecordID");
                entity.Property(e => e.FullNameOfMember)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.Gender)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.MemberId).HasColumnName("MemberID");
                entity.Property(e => e.Notes).HasColumnType("text");
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.RecordDate).HasColumnType("datetime");
                entity.Property(e => e.Result).HasColumnType("text");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.StaffId).HasColumnName("StaffID");
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Member).WithMany(p => p.TestServiceRecordMembers)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK__TestServi__Membe__5070F446");

                entity.HasOne(d => d.Service).WithMany(p => p.TestServiceRecords)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__TestServi__Servi__4F7CD00D");

                entity.HasOne(d => d.Staff).WithMany(p => p.TestServiceRecordStaffs)
                    .HasForeignKey(d => d.StaffId)
                    .HasConstraintName("FK__TestServi__Staff__5165187F");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__User__1788CCAC96B157BC");

                entity.ToTable("User");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("UserID");
                entity.Property(e => e.Address)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.Avatar)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.FullName)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Gender)
                    .HasMaxLength(15)
                    .IsUnicode(false);
                entity.Property(e => e.PasswordHash)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.HasMany(d => d.Specialties).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "UserSpecialty",
                        r => r.HasOne<Specialty>().WithMany()
                            .HasForeignKey("SpecialtyId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__UserSpeci__Speci__5FB337D6"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__UserSpeci__UserI__5EBF139D"),
                        j =>
                        {
                            j.HasKey("UserId", "SpecialtyId").HasName("PK__UserSpec__8AFE43C8519533A2");
                            j.ToTable("UserSpecialty");
                            j.IndexerProperty<int>("UserId").HasColumnName("UserID");
                            j.IndexerProperty<int>("SpecialtyId").HasColumnName("SpecialtyID");
                        });
            });

            modelBuilder.Entity<WorkSchedule>(entity =>
            {
                entity.HasKey(e => e.WorkScheduleId).HasName("PK__WorkSche__C6AC635E9F0F80BD");

                entity.ToTable("WorkSchedule");

                entity.Property(e => e.WorkScheduleId)
                    .ValueGeneratedNever()
                    .HasColumnName("WorkScheduleID");
                entity.Property(e => e.ConsultantId).HasColumnName("ConsultantID");
                entity.Property(e => e.Note)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.ShiftType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Consultant).WithMany(p => p.WorkSchedules)
                    .HasForeignKey(d => d.ConsultantId)
                    .HasConstraintName("FK__WorkSched__Consu__534D60F1");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}