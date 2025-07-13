using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class Appointment
    {
        public int AppointmentId { get; set; }

        public int MemberId { get; set; }

        public string? MeetLink { get; set; }

        public int? ServiceId { get; set; }

        public int? ConsultantId { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public string? Status { get; set; }

        public string? Symptoms { get; set; } // triệu chứng

        public virtual User? Consultant { get; set; }

        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

        public virtual User? Member { get; set; }

        public virtual Service? Service { get; set; }
    }
}