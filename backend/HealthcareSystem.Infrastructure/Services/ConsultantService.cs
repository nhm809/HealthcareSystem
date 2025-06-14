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
        public async Task<ConsultantDetailDTO?> GetConsultantDetailWithWorkScheduleAsync(int consultantId)
        {
            var u = await _context.Users.FirstOrDefaultAsync(x => x.UserId == consultantId);
            if (u == null) return null;

            var specialties = await _context.Specialties
                .FromSqlRaw(@"
                    SELECT s.* FROM Specialty s
                    INNER JOIN UserSpecialty us ON us.SpecialtyID = s.SpecialtyID
                    WHERE us.UserID = {0}", consultantId)
                .ToListAsync();

            var schedules = await _context.WorkSchedules
                .Where(ws => ws.ConsultantId == consultantId)
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
                WorkSchedules = schedules.Select(ws => new WorkScheduleDTO
                {
                    WorkDate = ws.WorkDate,
                    StartTime = ws.StartTime,
                    EndTime = ws.EndTime,
                    ShiftType = ws.ShiftType ?? "",
                    Note = ws.Note ?? ""
                }).ToList()
            };
        }
    }
}
