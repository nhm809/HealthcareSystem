using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class User
    {
        public int UserId { get; set; }

        public string? Provider { get; set; }

        public string? GoogleId { get; set; }

        public string? FullName { get; set; } = null!;

        public string? PasswordHash { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        public DateOnly? DoB { get; set; }

        public string? Gender { get; set; }

        public string? Address { get; set; }

        public DateOnly? CreateDate { get; set; }

        public string? Avatar { get; set; }

        public string? RoleId { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }

        public bool IsAvailable { get; set; } = true;

        public virtual ICollection<Appointment> AppointmentConsultants { get; set; } = new List<Appointment>();

        public virtual ICollection<Appointment> AppointmentMembers { get; set; } = new List<Appointment>();

        public virtual ICollection<BlogView> BlogViews { get; set; } = new List<BlogView>();

        public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();

        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        public virtual ICollection<OtpRequest> OtpRequests { get; set; } = new List<OtpRequest>();

        public virtual ICollection<Question> QuestionConsultants { get; set; } = new List<Question>();

        public virtual ICollection<Question> QuestionMembers { get; set; } = new List<Question>();

        public virtual ICollection<ReproductiveCycle> ReproductiveCycles { get; set; } = new List<ReproductiveCycle>();

        public virtual Role? Role { get; set; }

        public virtual ICollection<TestServiceRecord> TestServiceRecordMembers { get; set; } = new List<TestServiceRecord>();

        public virtual ICollection<TestServiceRecord> TestServiceRecordStaffs { get; set; } = new List<TestServiceRecord>();

        // public virtual ICollection<WorkSchedule> WorkSchedules { get; set; } = new List<WorkSchedule>();

        public virtual ICollection<WeeklySchedule> WeeklySchedules { get; set; } = new List<WeeklySchedule>();

        public virtual ICollection<WeeklyOverrideSchedule> WeeklyOverrideSchedules { get; set; } = new List<WeeklyOverrideSchedule>();

        public virtual ICollection<Specialty> Specialties { get; set; } = new List<Specialty>();


    }
}