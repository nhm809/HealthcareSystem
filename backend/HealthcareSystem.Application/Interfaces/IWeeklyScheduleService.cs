using HealthcareSystem.Application.DTOs;

namespace HealthcareSystem.Application.Interfaces
{
    public interface IWeeklyScheduleService
    {
        Task<WeeklyScheduleDTO> CreateWeeklyScheduleAsync(CreateWeeklyScheduleDTO createDto);
        Task<bool> DeleteWeeklyScheduleAsync(int weeklyScheduleId);
        Task<WeeklyScheduleDTO> UpdateWeeklyScheduleAsync(int weeklyScheduleId, UpdateWeeklyScheduleDTO updateDto);
        Task<List<WeeklyScheduleDTO>> GetWeeklySchedulesByUserIdAsync(int userId);
        Task<WeeklyScheduleDTO> GetWeeklyScheduleByIdAsync(int weeklyScheduleId);
        Task<List<WeeklyScheduleDTO>> SearchWeeklySchedulesAsync(int? userId = null, int? dayOfWeek = null, int? shiftType = null);
    }
} 