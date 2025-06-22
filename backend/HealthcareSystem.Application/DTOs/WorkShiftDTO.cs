namespace HealthcareSystem.Application.DTOs
{
    public class WorkShiftDTO
    {
        public int ShiftId { get; set; } // 1 = Ca 1, 2 = Ca 2
        public string ShiftName { get; set; } = string.Empty; // "Ca 1" - "Ca 2"
        public string StartTime { get; set; } = string.Empty; // "08:00" or "13:00"
        public string EndTime { get; set; } = string.Empty; // "12:00" or "17:00"
        public int CurrentBookings { get; set; }
        public int MaxBookings { get; set; }
        public bool IsAvailable { get; set; }
        public string Status { get; set; } = string.Empty;  
    }
} 