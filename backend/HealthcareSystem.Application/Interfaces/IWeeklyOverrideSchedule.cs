using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HealthcareSystem.Application.DTOs;

namespace HealthcareSystem.Application.Interfaces
{
    public interface IWeeklyOverrideSchedule
    {
        Task<WeeklyOverrideScheduleDTO> CreateAsync(CreateWeeklyOverrideScheduleDTO dto);
        Task<List<WeeklyOverrideScheduleDTO>> GetListAsync(int? userId = null, string? status = null, string? overrideType = null, DateTime? fromDate = null, DateTime? toDate = null, int? shiftType = null);
        Task<bool> UpdateStatusAsync(UpdateOverrideStatusDTO dto);
        Task<bool> DeleteAsync(int weeklyOverrideScheduleId);
    }
}
