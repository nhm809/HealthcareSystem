using System;

namespace Application.DTOs
{
    public class ReproductiveCycleDTO
    {
        public int? CycleId { get; set; }
        public int? MemberId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? ovulationDate { get; set; }
        public int? CycleLength { get; set; }
        public int? PeriodLength { get; set; }
        public int? PillTime { get; set; }
        public DateTime? fertileStart { get; set; }
        public DateTime? fertileEnd { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}