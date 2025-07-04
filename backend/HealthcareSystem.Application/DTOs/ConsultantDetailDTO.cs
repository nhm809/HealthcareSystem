using HealthcareSystem.Application.DTOs;

namespace Application.DTOs
{
    public class ConsultantDetailDTO : ConsultantWithSpecialtyDTO
    {
        public List<WeeklyScheduleDTO> WeeklySchedules { get; set; } = new();
        public List<WeeklyOverrideScheduleDTO> OverrideSchedules { get; set; } = new();
    }
}
