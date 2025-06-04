using Application.DTOs;
using Domain.Entities;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using HealthcareSystem.Application.DTOs;

namespace Infrastructure.Services
{
    public class TestServiceRecordService  : ITestServiceRecord
    {
        public readonly AppDbContext _context;
        public TestServiceRecordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId)
        {
            return await _context.TestServiceRecords
                .Where(r => r.MemberId == MemberId)
                .Select(r => new TestServiceRecordDTO
                {
                    TestServiceRecordId = r.TestServiceRecordId,
                    ServiceId = r.ServiceId,
                    MemberId = r.MemberId,
                    RecordDate = r.RecordDate,
                    Status = r.Status
                })
                .ToListAsync();
        }

        public async Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int ServiceId, int MemberId)
        {
            var record = await _context.TestServiceRecords
                .Include(r => r.Staff)
                .FirstOrDefaultAsync(r => r.ServiceId == ServiceId && r.MemberId == MemberId);

            if (record == null)
            {
                return null;
            }

            var SpecialtyId = await _context.UserSpecialties
                .Where(us => us.UserId == record.StaffId)
                .Select(us => us.SpecialtyId)
                .FirstOrDefaultAsync();

            var specialtyName = await _context.Specialties
               .Where(s => s.SpecialtyId == SpecialtyId)
               .Select(s => s.Name)
               .FirstOrDefaultAsync();


            return new TestServiceRecordDetailDTO
            {
                TestServiceRecordId = record.TestServiceRecordId,
                ServiceId = record.ServiceId,
                Result = record.Result,
                RecordDate = record.RecordDate,
                Notes = record.Notes,
                Status = record.Status,

                Staff = new StaffDTO
                {
                    StaffId = record.StaffId,
                    FullName = record.Staff.FullName,
                    Email = record.Staff.Email,
                    Avatar = record.Staff.Avatar,
                    SpecialtyName = specialtyName
                }
            };

        }




    }
}
