using System;

namespace Application.DTOs
{
    public class ReproductiveCycleDTO
    {
        public int? CycleId { get; set; }
        public int MemberId { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public DateOnly? OvulationDate { get; set; }
        public int? CycleLength { get; set; }
        public int? PeriodLength { get; set; }
        public TimeOnly? PillTime { get; set; }
        public DateOnly? FertileStart { get; set; }
        public DateOnly? FertileEnd { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}