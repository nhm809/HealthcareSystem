namespace Application.DTOs
{
    public class WorkScheduleDTO
    {
        public DateOnly? WorkDate { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public string ShiftType { get; set; }
        public string Note { get; set; }
    }
}
