using Application.DTOs;
using Domain.Entities;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using HealthcareSystem.Application.DTOs;
using System.Text.RegularExpressions;
using HealthcareSystem.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    
    public class TestServiceRecordService : ITestServiceRecord
    {
        // const int FIXED_SERVICE_ID = 1;
        const int MAX_TESTS_PER_STAFF = 20;
        public readonly AppDbContext _context;
        private readonly INotiService _notiService;

            public TestServiceRecordService(AppDbContext context, INotiService notiService)
        {
            _context = context;
            _notiService = notiService;
        }
        
        public async Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId)
        {
            return await _context.TestServiceRecords
                .Include(r => r.Service)
                .Where(r => r.MemberId == MemberId)
                .Select(r => new TestServiceRecordDTO
                {
                    TestServiceRecordId = r.TestServiceRecordId,
                    ServiceId = r.ServiceId,
                    ServiceName = r.Service.Name,
                    MemberId = r.MemberId,
                    RecordDate = r.RecordDate,
                    Status = r.Status
                })
                .ToListAsync();
        }

        public async Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int testServiceRecordId, int memberId)
        {
            var record = await _context.TestServiceRecords
                .Include(r => r.Staff)
                .Include(r => r.Service)
                .Select(r => new
                {
                    r.TestServiceRecordId,
                    r.ServiceId,
                    r.MemberId,
                    r.Result,
                    r.RecordDate,
                    r.Notes,
                    r.Status,
                    r.StaffId,
                    Staff = r.Staff == null ? null : new
                    {
                        r.Staff.FullName,
                        r.Staff.Email,
                        r.Staff.Avatar
                    }
                })
                .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId && r.MemberId == memberId);

            if (record == null)
            {
                return null;
            }

            var specialtyNames = await _context.Users
                .Where(u => u.UserId == record.StaffId)
                .SelectMany(u => u.Specialties)
                .Select(s => s.Name)
                .ToListAsync();

            return new TestServiceRecordDetailDTO
            {
                TestServiceRecordId = record.TestServiceRecordId,
                ServiceId = record.ServiceId,
                Result = record.Result,
                RecordDate = record.RecordDate,
                Notes = record.Notes,
                Status = record.Status,
                Staff  = record.Staff == null ? null : new StaffDTO
                {
                    FullName = record.Staff.FullName,
                    Email = record.Staff.Email,
                    Avatar = record.Staff.Avatar,
                    SpecialtyNames = specialtyNames
                }
            };
        }
        
        public async Task<bool> CanBookTestService(BookTestServiceRecordDTO request)
        {
            var testDate = request.TestDate;
            var shift = request.Shift;

            if (shift != 1 && shift != 2)
            {
                return false;
            }

            var existingUserBookingInShift = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.MemberId == request.UserId &&
                           r.Status != "Da huy" && 
                           r.Status != "Khach hang khong den" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .FirstOrDefaultAsync();

            if (existingUserBookingInShift != null)
            {
                return false; 
            }

            var count = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.Status == "Dang cho kham" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .CountAsync();

            return count < await GetMaxBookingsForShiftAsync(testDate, shift);
        }

        public async Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var testDate = request.TestDate;
            var shift = request.Shift;

            if (shift != 1 && shift != 2)
            {
                throw new ArgumentException("Chỉ có thể chọn Ca 1 hoặc Ca 2");
            }

            var existingUserBookingInShift = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.MemberId == request.UserId &&
                           r.Status != "Da huy" && 
                           r.Status != "Khach hang khong den" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .FirstOrDefaultAsync(); 

            if (existingUserBookingInShift != null)
            {
                throw new ArgumentException($"Bạn đã có lịch xét nghiệm vào Ca {shift} ngày {request.TestDate.ToString("dd/MM/yyyy")}. " +
                    "Mỗi khách hàng chỉ có thể đặt 1 lịch xét nghiệm mỗi ca.");
            }

            var count = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.Status == "Dang cho kham" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .CountAsync();

            var maxBookings = await GetMaxBookingsForShiftAsync(testDate, shift);
            if (count >= maxBookings)
            {
                throw new ArgumentException($"Rất tiếc, Ca {shift} ngày {request.TestDate.ToString("dd/MM/yyyy")} " +
                    $"đã đạt giới hạn số lượng đặt lịch ({maxBookings} ca). " +
                    "Quý khách vui lòng chọn ca khác hoặc ngày khác phù hợp hơn.");
            }

            var timeSlot = GetDefaultTimeSlotForShift(shift);

            var testServiceRecord = new TestServiceRecord
            {
                ServiceId = request.ServiceId,
                FullNameOfMember = request.FullName,
                Dob = request.Dob,
                TestDate = request.TestDate,
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MemberId = request.UserId, 
                Status = "Dang thanh toan",
                TimeSlot = timeSlot,
                RecordDate = DateTime.UtcNow.AddHours(7), 
                Result = "",
                StaffId = null, 
                Notes = ""
            };

            _context.TestServiceRecords.Add(testServiceRecord);
            await _context.SaveChangesAsync();

            return testServiceRecord.TestServiceRecordId;
        }

        public async Task<IEnumerable<WorkShiftDTO>> GetWorkShiftsAsync(DateOnly date)
        {
            var shifts = new List<WorkShiftDTO>();
            var maxBookingsShift1 = await GetMaxBookingsForShiftAsync(date, 1);
            var maxBookingsShift2 = await GetMaxBookingsForShiftAsync(date, 2);

            var shift1Bookings = await _context.TestServiceRecords
                .Where(r => r.TestDate == date && 
                           r.Status == "Dang cho kham" &&
                           r.TimeSlot >= new TimeSpan(8, 0, 0) && 
                           r.TimeSlot < new TimeSpan(12, 0, 0))
                .CountAsync();

            shifts.Add(new WorkShiftDTO
            {
                ShiftId = 1,
                ShiftName = "Ca 1",
                StartTime = "08:00",
                EndTime = "12:00",
                CurrentBookings = shift1Bookings,
                MaxBookings = maxBookingsShift1,
                IsAvailable = shift1Bookings < maxBookingsShift1,
                Status = shift1Bookings < maxBookingsShift1 ? "Còn chỗ" : "Hết chỗ"
            });

            var shift2Bookings = await _context.TestServiceRecords
                .Where(r => r.TestDate == date && 
                           r.Status == "Dang cho kham" &&
                           r.TimeSlot >= new TimeSpan(13, 0, 0) && 
                           r.TimeSlot < new TimeSpan(17, 0, 0))
                .CountAsync();

            shifts.Add(new WorkShiftDTO
            {
                ShiftId = 2,
                ShiftName = "Ca 2",
                StartTime = "13:00",
                EndTime = "17:00",
                CurrentBookings = shift2Bookings,
                MaxBookings = maxBookingsShift2,
                IsAvailable = shift2Bookings < maxBookingsShift2,
                Status = shift2Bookings < maxBookingsShift2 ? "Còn chỗ" : "Hết chỗ"
            });

            return shifts;
        }


        private TimeSpan GetDefaultTimeSlotForShift(int shift)
        {
            if (shift == 1)
                return new TimeSpan(8, 0, 0); 
            else if (shift == 2)
                return new TimeSpan(13, 0, 0); 
            else
                throw new ArgumentException("Ca làm việc không hợp lệ.");
        }

        private async Task<int> GetMaxBookingsForShiftAsync(DateOnly date, int shift)
        {
            var dayOfWeek = (int)date.DayOfWeek;

            var regularStaff = await _context.WeeklySchedules
                .Where(ws => ws.DayOfWeek == dayOfWeek && ws.ShiftType == shift && ws.User.IsAvailable)
                .Select(ws => ws.UserId)
                .ToListAsync();

            var overriddenStaff = await _context.WeeklyOverrideSchedules
                .Where(os => os.Date.Year == date.Year && os.Date.Month == date.Month && os.Date.Day == date.Day)
                .ToListAsync();

            var staffOnLeave = overriddenStaff
                .Where(os => os.OverrideType == "Nghỉ" && regularStaff.Contains(os.UserId))
                .Select(os => os.UserId);

            var workingStaffCount = regularStaff.Except(staffOnLeave).Count();
            
            return workingStaffCount * MAX_TESTS_PER_STAFF;
        }

        public async Task<TestServiceRecordDetailDTO> UpdateTestResultAsync(UpdateTestResultDTO request, int staffId)
        {
            var testServiceRecord = await _context.TestServiceRecords
                .Include(r => r.Staff)
                .FirstOrDefaultAsync(x => x.TestServiceRecordId == request.TestServiceRecordId && x.StaffId == staffId);

            if (testServiceRecord == null)
                throw new ArgumentException("Không tìm thấy bản ghi xét nghiệm .");

            if (testServiceRecord.Status == "Da huy")
                throw new ArgumentException("Không thể cập nhật bản ghi xét nghiệm đã bị hủy.");

            var oldStatus = testServiceRecord.Status;
            var oldNotes = testServiceRecord.Notes;
            var oldResult = testServiceRecord.Result;

            bool statusChanged = request.Status != oldStatus;
            bool notesChanged = !string.IsNullOrEmpty(request.Notes) && request.Notes != oldNotes;
            bool resultChanged = request.Result != oldResult;

            testServiceRecord.Status = request.Status;
            testServiceRecord.Notes = request.Notes;
            testServiceRecord.Result = request.Result;

            List<string> changedFields = new();
            if (statusChanged) changedFields.Add("trạng thái");
            if (notesChanged) changedFields.Add("ghi chú");
            if (resultChanged) changedFields.Add("kết quả xét nghiệm");

            string notificationContent = "";
            if (changedFields.Count > 0)
            {
                notificationContent = $"Bác sĩ đã cập nhật {string.Join(", ", changedFields)} cho xét nghiệm của bạn.";
            }
            await _context.SaveChangesAsync();

            if (testServiceRecord.MemberId.HasValue && !string.IsNullOrEmpty(notificationContent))
            {
                var Notification = new Notification
                {
                    UserId = testServiceRecord.MemberId.Value,
                    Title = "Cập nhật thông tin xét nghiệm",
                    Content = notificationContent,
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false
                };

                _context.Notifications.Add(Notification);
                await _context.SaveChangesAsync();
            }

            var specialtyNames = await _context.Users
                .Where(u => u.UserId == testServiceRecord.StaffId)
                .SelectMany(u => u.Specialties)
                .Select(s => s.Name)
                .ToListAsync();

            return new TestServiceRecordDetailDTO
            {
                TestServiceRecordId = testServiceRecord.TestServiceRecordId,
                ServiceId = testServiceRecord.ServiceId,
                Result = testServiceRecord.Result,
                RecordDate = testServiceRecord.RecordDate,
                Notes = testServiceRecord.Notes,
                Status = testServiceRecord.Status,
                Staff = testServiceRecord.Staff == null ? null : new StaffDTO
                {
                    FullName = testServiceRecord.Staff.FullName,
                    Email = testServiceRecord.Staff.Email,
                    Avatar = testServiceRecord.Staff.Avatar,
                    SpecialtyNames = specialtyNames
                }
            };
        }

        public async Task<bool> CancelTestResultAsync(int testServiceRecordId, int userId)
        {
            var testServiceRecord = await _context.TestServiceRecords
                .FirstOrDefaultAsync(x => x.TestServiceRecordId == testServiceRecordId && x.MemberId == userId);

            if (testServiceRecord == null)
            {
                throw new ArgumentException("Không tìm thấy bản ghi xét nghiệm.");
            }

            if (testServiceRecord.Status == "Da huy")
            {
                throw new ArgumentException("Bản ghi xét nghiệm đã bị hủy trước đó.");
            }else if (testServiceRecord.Status == "Da hoan thanh")
            {
                throw new ArgumentException("Xét nghiệm đã hoàn thành.");
            }else if (testServiceRecord.Status == "Dang cho kham")
            {
                throw new ArgumentException("Xét nghiệm đang trong quá trình chờ khám quý khách cân nhắc trước khi hủy .");
            }else if (testServiceRecord.Status == "Khach hang khong den")
            {
                throw new ArgumentException("Bản ghi xét nghiệm đã quá hạn.");
            }

            testServiceRecord.Status = "Da huy";
            await _context.SaveChangesAsync();

            if (testServiceRecord.MemberId.HasValue)
            {
                var Notification = new Notification
                {
                    UserId = testServiceRecord.MemberId.Value,
                    Title = "Hủy xét nghiệm",
                    Content = "Xét nghiệm của bạn đã được hủy.",
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false
                };

                 _context.Notifications.Add(Notification);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<IEnumerable<TestServiceRecordStaffDTO>> GetTestServiceRecordByStatusAsync(){
             return await _context.TestServiceRecords
                .Where(r => r.Status == "Dang cho kham")
                .Select(r => new TestServiceRecordStaffDTO
                {
                    TestServiceRecordId = r.TestServiceRecordId,
                    ServiceId = r.ServiceId,
                    Gender = r.Gender,
                    PhoneNumber = r.PhoneNumber,
                    FullNameOfMember = r.FullNameOfMember,
                    Result = r.Result,
                    StaffId = r.StaffId,
                    TestDate = r.TestDate,
                    MemberId = r.MemberId,
                    Notes = r.Notes,
                    RecordDate = r.RecordDate,
                    Status = r.Status
                })
                .ToListAsync();

        }

        public async Task<IEnumerable<TestServiceRecordStaffDTO>> GetTestServiceRecordByStaffIdAsync(int staffId){
             return await _context.TestServiceRecords
                .Where(r => r.StaffId == staffId)
                .Select(r => new TestServiceRecordStaffDTO
                {
                    TestServiceRecordId = r.TestServiceRecordId,
                    ServiceId = r.ServiceId,
                    Gender = r.Gender,
                    PhoneNumber = r.PhoneNumber,
                    FullNameOfMember = r.FullNameOfMember,
                    Result = r.Result,
                    StaffId = r.StaffId,
                    TestDate = r.TestDate,
                    MemberId = r.MemberId,
                    Notes = r.Notes,
                    RecordDate = r.RecordDate,
                    Status = r.Status
                })
                .ToListAsync();
        }
    }
}