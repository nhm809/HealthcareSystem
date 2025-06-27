using System;

namespace HealthcareSystem.Application.DTOs
{
    public class WeeklyScheduleDTO
    {
        public int WeeklyScheduleId { get; set; }
        public int UserId { get; set; }
        public int DayOfWeek { get; set; } // Sunday = 0, ..., Saturday = 6
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int ShiftType { get; set; }
        public string? Note { get; set; }
    }
} 