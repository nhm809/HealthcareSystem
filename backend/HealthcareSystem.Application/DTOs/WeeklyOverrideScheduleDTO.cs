using System;

namespace Application.DTOs
{
    public class WeeklyOverrideScheduleDTO
    {
        public DateTime Date { get; set; }
        public TimeSpan? NewStartTime { get; set; }
        public TimeSpan? NewEndTime { get; set; }
        public string? OverrideType { get; set; } 
        public string? Reason { get; set; }
    }
} 