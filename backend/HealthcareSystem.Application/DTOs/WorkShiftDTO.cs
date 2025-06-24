namespace HealthcareSystem.Application.DTOs
{
    public class WorkShiftDTO
    {
        public int ShiftId { get; set; }  
        public string ShiftName { get; set; } = string.Empty;  
        public string StartTime { get; set; } = string.Empty; 
        public string EndTime { get; set; } = string.Empty;  
        public int CurrentBookings { get; set; }
        public int MaxBookings { get; set; }
        public bool IsAvailable { get; set; }
        public string Status { get; set; } = string.Empty;  
    }
} 