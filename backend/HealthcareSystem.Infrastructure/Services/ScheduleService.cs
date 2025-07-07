using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly AppDbContext _context;
        public ScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DayScheduleDTO>> GetUserWeekScheduleAsync(int userId, int offset = 0)
        {
            var today = DateTime.Today;
            var sunday = today.AddDays(-(int)today.DayOfWeek).AddDays(offset * 7);
            var days = Enumerable.Range(0, 7).Select(d => sunday.AddDays(d)).ToList();

            var weeklySchedules = await _context.WeeklySchedules
                .Where(ws => ws.UserId == userId)
                .ToListAsync();
            var overrideSchedules = await _context.WeeklyOverrideSchedules
                .Where(os => os.UserId == userId && os.Date >= sunday && os.Date < sunday.AddDays(7))
                .ToListAsync();
                
            var result = new List<DayScheduleDTO>();
            foreach (var day in days)
            {
                var dayOfWeek = (int)day.DayOfWeek;
                var shifts = new List<ShiftScheduleDTO>();
                
                // Check fullDay off
                var fullDayOff = overrideSchedules.FirstOrDefault(o => o.Date.Date == day.Date && o.ShiftType == 3 && o.OverrideType == "Nghỉ" && o.Status == "Đã xác nhận");
                if (fullDayOff != null)
                {
                    continue; 
                }

                // Check normalShift
                var normalShifts = weeklySchedules.Where(ws => ws.DayOfWeek == dayOfWeek).ToList();
                foreach (var ws in normalShifts)
                {
                    var ov = overrideSchedules.FirstOrDefault(o => o.Date.Date == day.Date && o.ShiftType == ws.ShiftType);
                    
                    if (ov != null && ov.Status == "Đã xác nhận")
                    {
                        shifts.Add(new ShiftScheduleDTO
                        {
                            ShiftType = ws.ShiftType,
                            Status = ov.OverrideType,
                            Note = ws.Note
                        });
                    }
                    else if (ov != null && ov.Status == "Đang chờ duyệt")
                    {
                        shifts.Add(new ShiftScheduleDTO
                        {
                            ShiftType = ws.ShiftType,
                            Status = $"Chờ duyệt {ov.OverrideType}",
                            Note = ws.Note
                        });
                    }
                    else // Reject by MN
                    {
                        shifts.Add(new ShiftScheduleDTO
                        {
                            ShiftType = ws.ShiftType,
                            Status = "Làm việc",
                            Note = ws.Note
                        });
                    }
                }

                // Add overtime shifts (if not conflicting with normal shifts)
                var overtimeOverrides = overrideSchedules.Where(o => o.Date.Date == day.Date && o.OverrideType == "Làm thêm" && o.Status == "Đã xác nhận");
                foreach (var ov in overtimeOverrides)
                {
                    if (!shifts.Any(s => s.ShiftType == ov.ShiftType))
                    {
                        shifts.Add(new ShiftScheduleDTO
                        {
                            ShiftType = ov.ShiftType ?? 0,
                            Status = "Làm thêm",
                            Note = null
                        });
                    }
                }

                shifts = shifts.Where(s => s.Status != "Nghỉ").ToList();
                if (shifts.Any())
                {
                    result.Add(new DayScheduleDTO
                    {
                        Date = day,
                        Shifts = shifts.OrderBy(s => s.ShiftType).ToList()
                    });
                }
            }
            return result;
        }
    }
} 