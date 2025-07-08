namespace HealthcareSystem.Application.DTOs
{
    public class UpdateWeeklyScheduleDTO
    {
        public int DayOfWeek { get; set; }
        public int ShiftType { get; set; }
        public string? Note { get; set; }
    }
} 