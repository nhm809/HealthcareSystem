using System;

namespace HealthcareSystem.Application.DTOs
{
    public class WeeklyOverrideScheduleDTO 
    {
        public int WeeklyOverrideScheduleId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string? OverrideType { get; set; }
        public string? Reason { get; set; }
        public int? ShiftType { get; set; }
        public string Status { get; set; }
        public string? UserName { get; set; }
        public string? RoleName { get; set; }
    }
}