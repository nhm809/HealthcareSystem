using System;

namespace HealthcareSystem.Application.DTOs
{
    public class WeeklyScheduleDTO
    {
        public int WeeklyScheduleId { get; set; }
        public int UserId { get; set; }
        public int DayOfWeek { get; set; }  
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int ShiftType { get; set; }
        public string? Note { get; set; }
    }

    public class CreateWeeklyScheduleDTO
    {
        public int UserId { get; set; }
        public int DayOfWeek { get; set; }  
        public int ShiftType { get; set; }  
        public string? Note { get; set; }
    }

} 