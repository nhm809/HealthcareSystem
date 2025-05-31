using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class ReportServiceDetail
    {
        public int ReportServiceId { get; set; }

        public string? ReportPeriod { get; set; }

        public int? ServiceId { get; set; }

        public int? UsageCount { get; set; }

        public decimal? AvgRating { get; set; }

        public decimal? TotalRevenue { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual Service? Service { get; set; }
    }
}