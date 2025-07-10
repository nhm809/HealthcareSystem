using System;

namespace HealthcareSystem.Application.DTOs
{
    public class CreateWeeklyOverrideScheduleDTO
    {
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string OverrideType { get; set; } 
        public string? Reason { get; set; }
        public int? ShiftType { get; set; }
    }
} 