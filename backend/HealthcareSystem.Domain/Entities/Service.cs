using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class Service
    {
        public int ServiceId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }
        

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        public virtual ICollection<ReportServiceDetail> ReportServiceDetails { get; set; } = new List<ReportServiceDetail>();

        public virtual ICollection<TestServiceRecord> TestServiceRecords { get; set; } = new List<TestServiceRecord>();
    }
}