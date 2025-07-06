using System;
using System.Collections.Generic;

namespace HealthcareSystem.Application.DTOs
{
    public class DayScheduleDTO
    {
        public DateTime Date { get; set; }
        public List<ShiftScheduleDTO> Shifts { get; set; } = new();
    }

    public class ShiftScheduleDTO
    {
        public int ShiftType { get; set; }
        public string Status { get; set; } // "Làm việc", "Nghỉ", "Làm thêm"
        public string? Note { get; set; }
    }
} 