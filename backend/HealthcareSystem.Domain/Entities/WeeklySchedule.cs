using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class WeeklySchedule
    {
        public int WeeklyScheduleId { get; set; }
        public int UserId { get; set; }
        public int DayOfWeek { get; set; } // 0: Chủ nhật, 1: Thứ 2, ...
        [Column(TypeName = "TIME")]
        public TimeSpan StartTime { get; set; }
        [Column(TypeName = "TIME")]
        public TimeSpan EndTime { get; set; }
        public int ShiftType { get; set; } // 1: Ca 1, 2: Ca 2
        public string? Note { get; set; } 
        public virtual User User { get; set; }
    }
} 