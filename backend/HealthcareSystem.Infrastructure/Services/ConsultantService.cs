using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;

namespace Infrastructure.Services
{
    public class ConsultantService : IConsultantService
    {
        private readonly AppDbContext _context;

        public ConsultantService(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get all consultants (dựa trên User có trong bảng UserSpecialty)
        public async Task<List<ConsultantWithSpecialtyDTO>> GetAllConsultantsWithSpecialtiesAsync()
        {
            var users = await _context.Users
                .FromSqlRaw(@"
                    SELECT DISTINCT u.* FROM [User] u
                    INNER JOIN UserSpecialty us ON us.UserID = u.UserID
                ")
                .ToListAsync();

            var result = new List<ConsultantWithSpecialtyDTO>();

            foreach (var u in users)
            {
                var specialties = await _context.Specialties
                    .FromSqlRaw(@"
                        SELECT s.* FROM Specialty s
                        INNER JOIN UserSpecialty us ON us.SpecialtyID = s.SpecialtyID
                        WHERE us.UserID = {0}", u.UserId)
                    .ToListAsync();

                result.Add(new ConsultantWithSpecialtyDTO
                {
                    ConsultantId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Specialties = specialties.Select(s => new SpecialtyDTO
                    {
                        Id = s.SpecialtyId,
                        Name = s.Name
                    }).ToList()
                });
            }

            return result;
        }

        // ✅ Get detail of one consultant (chuyên môn + lịch làm việc)
        public async Task<ConsultantDetailDTO?> GetConsultantDetailAsync(int consultantId)
        {
            var u = await _context.Users.FirstOrDefaultAsync(x => x.UserId == consultantId);
            if (u == null) return null;

            var specialties = await _context.Specialties
                .FromSqlRaw(@"
                    SELECT s.* FROM Specialty s
                    INNER JOIN UserSpecialty us ON us.SpecialtyID = s.SpecialtyID
                    WHERE us.UserID = {0}", consultantId)
                .ToListAsync();

            var weeklySchedules = await _context.WeeklySchedules
                .Where(ws => ws.UserId == consultantId)
                .ToListAsync();

            var overrideSchedules = await _context.WeeklyOverrideSchedules
                .Where(os => os.UserId == consultantId && os.Date >= DateTime.Today)
                .ToListAsync();

            return new ConsultantDetailDTO
            {
                ConsultantId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Specialties = specialties.Select(s => new SpecialtyDTO
                {
                    Id = s.SpecialtyId,
                    Name = s.Name
                }).ToList(),
                WeeklySchedules = weeklySchedules.Select(ws => new WeeklyScheduleDTO
                {
                    DayOfWeek = ws.DayOfWeek,
                    StartTime = ws.StartTime,
                    EndTime = ws.EndTime,
                    ShiftType = ws.ShiftType
                }).ToList(),
                OverrideSchedules = overrideSchedules.Select(os => new WeeklyOverrideScheduleDTO
                {
                    Date = os.Date,
                    NewStartTime = os.NewStartTime,
                    NewEndTime = os.NewEndTime,
                    OverrideType = os.OverrideType,
                    Reason = os.Reason
                }).ToList()
            };
        }
        public async Task<List<FreeSlotDTO>> GetAvailableTimeSlotsByDateAsync(int consultantId, DateTime date)
        {
            if (date.DayOfWeek == DayOfWeek.Sunday) return new List<FreeSlotDTO>();

            int dayOfWeek = (int)date.DayOfWeek;

            var schedules = await _context.WeeklySchedules
                .Where(ws => ws.UserId == consultantId && ws.DayOfWeek == dayOfWeek)
                .ToListAsync();

            var overrideDay = await _context.WeeklyOverrideSchedules
                .FirstOrDefaultAsync(o => o.UserId == consultantId && o.Date == date);

            if (overrideDay?.OverrideType?.ToLower() == "nghỉ") return new List<FreeSlotDTO>();

            var appointments = await _context.Appointments
                .Where(a => a.ConsultantId == consultantId &&
                            a.StartTime.HasValue &&
                            a.StartTime.Value.Date == date &&
                            a.Status != "Đã hủy")
                .ToListAsync();

            var freeSlots = new List<FreeSlotDTO>();

            foreach (var s in schedules)
            {
                var startTime = overrideDay?.NewStartTime ?? s.StartTime;
                var endTime = overrideDay?.NewEndTime ?? s.EndTime;

                for (var time = startTime; time + TimeSpan.FromMinutes(30) <= endTime; time += TimeSpan.FromMinutes(30))
                {
                    var startDateTime = date + time;
                    var endDateTime = startDateTime.AddMinutes(30);

                    bool hasAppointment = appointments.Any(a =>
                        a.StartTime < endDateTime && a.EndTime > startDateTime);

                    if (!hasAppointment)
                    {
                        freeSlots.Add(new FreeSlotDTO
                        {
                            Date = date,
                            Start = startDateTime,
                            End = endDateTime
                        });
                    }
                }
            }

            return freeSlots;
        }


    }
}
