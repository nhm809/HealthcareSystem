using System;

namespace HealthcareSystem.Application.DTOs
{
    public class UpdateOverrideStatusDTO
    {
        public int WeeklyOverrideScheduleId { get; set; }
        public string Status { get; set; } 
    }
} 