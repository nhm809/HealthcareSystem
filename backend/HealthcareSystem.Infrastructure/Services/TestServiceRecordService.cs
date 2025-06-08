using Application.DTOs;
using Domain.Entities;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using HealthcareSystem.Application.DTOs;
using System.Text.RegularExpressions;

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


        public async Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrWhiteSpace(request.FullName))
                throw new ArgumentException("Họ và tên không được để trống.");

            if (request.Dob > DateTime.Now)
                throw new ArgumentException("Ngày sinh không được là ngày trong tương lai.");

            //if (!new[] { "Male", "Female", "Other" }.Contains(request.Gender))
            //    throw new ArgumentException("Giới tính không hợp lệ.");

            if (!Regex.IsMatch(request.PhoneNumber, @"^0\d{9}$"))
                throw new ArgumentException("Số điện thoại không hợp lệ.");

            var service = await _context.Services.FindAsync(request.ServiceId);
            if (service == null)
                throw new ArgumentException("Dịch vụ không tồn tại.");

            if (request.MemberId.HasValue)//Fe gửi MemberId = 0 nếu không đăng nhập nha
            {
                var user = await _context.Users.FindAsync(request.MemberId);
                if (user == null)
                    throw new ArgumentException("Người dùng không tồn tại.");
            }

            var testServiceRecord = new TestServiceRecord
            {
                ServiceId = request.ServiceId,
                FullNameOfMember = request.FullName,
                Dob = DateOnly.FromDateTime(request.Dob),
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MemberId = request.MemberId,
                Status = "Dịch vụ đang chờ thanh toán",
                RecordDate = DateTime.UtcNow.AddHours(7), // UTC+7 cho Việt Nam
                Result = null,
                StaffId = null, // Chưa có nhân viên phục vụ
                Notes = null  
            };

            _context.TestServiceRecords.Add(testServiceRecord);
            await _context.SaveChangesAsync();

            return testServiceRecord.TestServiceRecordId;
        }




    }
}
