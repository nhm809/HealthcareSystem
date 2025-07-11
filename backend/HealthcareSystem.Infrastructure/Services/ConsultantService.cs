using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using HealthcareSystem.Application.DTOs;

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
                .Where(u => u.RoleId == "CS")
                .Include(u => u.Specialties) // Eager load specialties qua User.Specialties
                .ToListAsync();

            var result = users.Select(u => new ConsultantWithSpecialtyDTO
            {
                ConsultantId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Specialties = u.Specialties.Select(s => new SpecialtyDTO
                {
                    Id = s.SpecialtyId,
                    Name = s.Name
                }).ToList()
            }).ToList();

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
                    ShiftType = ws.ShiftType // Đây là int
                }).ToList(),
                OverrideSchedules = overrideSchedules.Select(os => new WeeklyOverrideScheduleDTO
                {
                    Date = os.Date,
                    ShiftType = os.ShiftType, // Đây là int?
                    OverrideType = os.OverrideType,
                    Reason = os.Reason
                }).ToList()
            };
        }

        public async Task<List<FreeSlotDTO>> GetAvailableTimeSlotsByDateAsync(int consultantId, DateTime date)
        {
            // Bước 1: Kiểm tra xem consultant có tồn tại và IsAvailable hay không
            var consultant = await _context.Users
                                    .Where(u => u.UserId == consultantId)
                                    .Select(u => new { u.IsAvailable, u.RoleId }) // Chỉ lấy những thuộc tính cần thiết
                                    .FirstOrDefaultAsync();

            if (consultant == null || !consultant.IsAvailable || consultant.RoleId != "CS") // Chỉ xử lý cho consultant và phải có IsAvailable = true
            {
                return new List<FreeSlotDTO>();
            }

            if (date.DayOfWeek == DayOfWeek.Sunday) return new List<FreeSlotDTO>();

            int dayOfWeek = (int)date.DayOfWeek;

            var schedules = await _context.WeeklySchedules
                .Where(ws => ws.UserId == consultantId && ws.DayOfWeek == dayOfWeek)
                .ToListAsync();

            var overrideDay = await _context.WeeklyOverrideSchedules
                .FirstOrDefaultAsync(o => o.UserId == consultantId && o.Date == date);

            // Nếu ngày đó là ngày nghỉ được ghi đè, trả về danh sách trống
            if (overrideDay?.OverrideType?.ToLower() == "nghỉ") return new List<FreeSlotDTO>();

            var appointments = await _context.Appointments
                .Where(a => a.ConsultantId == consultantId &&
                            a.StartTime.HasValue &&
                            a.StartTime.Value.Date == date.Date && // So sánh chỉ phần ngày
                            a.Status != "Đã hủy")
                .ToListAsync();

            var freeSlots = new List<FreeSlotDTO>();

            foreach (var s in schedules)
            {
                TimeSpan currentShiftStartTime;
                TimeSpan currentShiftEndTime;

                // Nếu có lịch ghi đè cho ngày cụ thể và có ShiftType được định nghĩa (có giá trị)
                if (overrideDay != null && overrideDay.ShiftType.HasValue)
                {
                    var (overriddenStart, overriddenEnd) = GetTimeRangeFromIntShiftType(overrideDay.ShiftType.Value);
                    currentShiftStartTime = overriddenStart;
                    currentShiftEndTime = overriddenEnd;
                }
                else
                {
                    // Nếu không có lịch ghi đè, hoặc lịch ghi đè không chỉ định ShiftType,
                    // sử dụng StartTime và EndTime từ lịch tuần thông thường (đã được định nghĩa sẵn theo ShiftType của WeeklySchedule)
                    currentShiftStartTime = s.StartTime;
                    currentShiftEndTime = s.EndTime;
                }

                // Lặp qua các khung thời gian 30 phút trong ca làm việc
                for (var time = currentShiftStartTime; time + TimeSpan.FromMinutes(30) <= currentShiftEndTime; time += TimeSpan.FromMinutes(30))
                {
                    var startDateTime = date.Date + time; // Kết hợp ngày từ tham số và giờ từ khung giờ
                    var endDateTime = startDateTime.AddMinutes(30);

                    // Kiểm tra xem khung thời gian hiện tại có bị trùng với lịch hẹn nào đã có không
                    bool hasAppointment = appointments.Any(a =>
                        a.StartTime < endDateTime && a.EndTime > startDateTime);

                    if (!hasAppointment)
                    {
                        freeSlots.Add(new FreeSlotDTO
                        {
                            Date = date.Date, // Chỉ lưu phần ngày
                            Start = startDateTime,
                            End = endDateTime
                        });
                    }
                }
            }

            return freeSlots;
        }

        /// <summary>
        /// Hàm trợ giúp để chuyển đổi ShiftType (số nguyên) sang cặp TimeSpan (StartTime, EndTime).
        /// Dựa trên định nghĩa của bạn: 1: Ca 1, 2: Ca 2
        /// </summary>
        /// <param name="shiftType">Loại ca làm việc (1, 2, ...)</param>
        /// <returns>Cặp TimeSpan chứa thời gian bắt đầu và kết thúc của ca.</returns>
        /// <exception cref="ArgumentOutOfRangeException">Ném ra nếu shiftType không hợp lệ.</exception>
        private (TimeSpan Start, TimeSpan End) GetTimeRangeFromIntShiftType(int shiftType)
        {
            switch (shiftType)
            {
                case 1: // Ca 1
                    return (new TimeSpan(8, 0, 0), new TimeSpan(12, 0, 0)); // Ví dụ: 8:00 AM - 12:00 PM
                case 2: // Ca 2
                    return (new TimeSpan(13, 0, 0), new TimeSpan(17, 0, 0)); // Ví dụ: 1:00 PM - 5:00 PM
                // Thêm các trường hợp khác nếu có các loại ca làm việc đặc biệt (e.g., Ca 3, ...)
                default:
                    // Trả về một khoảng thời gian không hợp lệ hoặc ném lỗi nếu shiftType không hợp lệ
                    throw new ArgumentOutOfRangeException(nameof(shiftType), $"ShiftType {shiftType} không hợp lệ.");
            }
        }
    }
}