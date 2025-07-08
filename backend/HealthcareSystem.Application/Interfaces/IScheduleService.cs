using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthcareSystem.Application.DTOs;

namespace HealthcareSystem.Application.Interfaces
{
    public interface IScheduleService
    {
        Task<IEnumerable<DayScheduleDTO>> GetUserWeekScheduleAsync(int userId, int offset = 0);
    }
} 