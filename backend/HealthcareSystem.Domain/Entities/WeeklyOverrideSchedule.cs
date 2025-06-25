using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class WeeklyOverrideSchedule
    {
        public int WeeklyOverrideScheduleId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string? OverrideType { get; set; } 
        public string? Reason { get; set; }  
        public int? ShiftType { get; set; }
        [Column(TypeName = "nvarchar(30)")]
        public string Status { get; set; }
        public virtual User User { get; set; }
    }
}
