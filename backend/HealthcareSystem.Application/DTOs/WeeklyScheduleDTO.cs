using System;

namespace Application.DTOs
{
    public class WeeklyScheduleDTO
    {
        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int ShiftType { get; set; }
        public string? Note { get; set; }
    }
} 