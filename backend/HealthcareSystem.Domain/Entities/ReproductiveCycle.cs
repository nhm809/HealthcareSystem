using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class ReproductiveCycle
    {
        public int CycleId { get; set; }

        public int MemberId { get; set; }

        public DateOnly? StartDate { get; set; }

        public int? CycleLength { get; set; }

        public int? PeriodLength { get; set; }

        public TimeOnly? PillTime { get; set; }

        public DateTime? LastUpdated { get; set; }

        public virtual User? Member { get; set; }
    }
}