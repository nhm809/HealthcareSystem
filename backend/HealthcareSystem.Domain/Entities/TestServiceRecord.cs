using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{

    public partial class TestServiceRecord
    {
        public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Gender { get; set; }

        public string? PhoneNumber { get; set; }

        public string? FullNameOfMember { get; set; }

        public int? MemberId { get; set; }

        public string? Result { get; set; }

        public int? StaffId { get; set; }

        public DateTime? RecordDate { get; set; }

        public DateOnly? TestDate { get; set; } //

        [Column(TypeName = "TIME")]
        public TimeSpan? TimeSlot { get; set; }

        public string? Notes { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Status { get; set; }

        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

        public virtual User? Member { get; set; }

        public virtual Service? Service { get; set; }

        public virtual User? Staff { get; set; }
    }
}