using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

public interface IConsultantService
{
    Task<List<ConsultantWithSpecialtyDTO>> GetAllConsultantsWithSpecialtiesAsync();
    Task<ConsultantDetailDTO?> GetConsultantDetailWithWorkScheduleAsync(int consultantId);
}


