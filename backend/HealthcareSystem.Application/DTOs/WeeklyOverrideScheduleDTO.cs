using System;

namespace Application.DTOs
{
    public class WeeklyOverrideScheduleDTO
    {
        public DateTime Date { get; set; }
        public string? OverrideType { get; set; } 
        public string? Reason { get; set; }
        public int? ShiftType { get; set; }
        public string? Status { get; set; }
    }
} 