namespace Application.DTOs
{
    public class ConsultantDetailDTO : ConsultantWithSpecialtyDTO
    {
        public List<WorkScheduleDTO> WorkSchedules { get; set; }
    }
}
