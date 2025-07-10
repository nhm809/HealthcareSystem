using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

public interface IConsultantService
{
    Task<List<ConsultantWithSpecialtyDTO>> GetAllConsultantsWithSpecialtiesAsync();
    Task<ConsultantDetailDTO?> GetConsultantDetailAsync(int consultantId);
    Task<List<FreeSlotDTO>> GetAvailableTimeSlotsByDateAsync(int consultantId, DateTime date);
    Task<List<ConsultantWithSpecialtyDTO>> GetConsultantsWithFreeSlotsByDateAsync(DateTime date);

}


