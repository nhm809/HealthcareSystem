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
        const int FIXED_SERVICE_ID = 1;
        const int MAX_BOOKINGS_PER_SHIFT = 40; // Tối đa 40 booking per ca
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

            // Check 1: Kiểm tra xem user đã có booking nào trong ca này chưa
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
                return false; // User đã có booking trong ca này
            }

            // Check 2: Kiểm tra giới hạn số lượng booking trong ca
            var count = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.Status == "Dang cho kham" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .CountAsync();

            return count < MAX_BOOKINGS_PER_SHIFT;
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

            // Check 1: Kiểm tra xem user đã có booking nào trong ca này chưa
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

            // Check 2: Kiểm tra giới hạn số lượng booking trong ca
            var count = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.Status == "Dang cho kham" &&
                           (shift == 1 ? 
                               (r.TimeSlot >= new TimeSpan(8, 0, 0) && r.TimeSlot < new TimeSpan(12, 0, 0)) :
                               (r.TimeSlot >= new TimeSpan(13, 0, 0) && r.TimeSlot < new TimeSpan(17, 0, 0))))
                .CountAsync();

            if (count >= MAX_BOOKINGS_PER_SHIFT)
            {
                throw new ArgumentException($"Rất tiếc, Ca {shift} ngày {request.TestDate.ToString("dd/MM/yyyy")} " +
                    $"đã đạt giới hạn số lượng đặt lịch ({MAX_BOOKINGS_PER_SHIFT} ca). " +
                    "Quý khách vui lòng chọn ca khác hoặc ngày khác phù hợp hơn.");
            }

            // Tạo TimeSlot mặc định cho ca (có thể random hoặc theo logic cụ thể)
            var timeSlot = GetDefaultTimeSlotForShift(shift);

            var testServiceRecord = new TestServiceRecord
            {
                ServiceId = FIXED_SERVICE_ID,
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
                MaxBookings = MAX_BOOKINGS_PER_SHIFT,
                IsAvailable = shift1Bookings < MAX_BOOKINGS_PER_SHIFT,
                Status = shift1Bookings < MAX_BOOKINGS_PER_SHIFT ? "Còn chỗ" : "Hết chỗ"
            });

            // Ca 2: 13:00 - 17:00
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
                MaxBookings = MAX_BOOKINGS_PER_SHIFT,
                IsAvailable = shift2Bookings < MAX_BOOKINGS_PER_SHIFT,
                Status = shift2Bookings < MAX_BOOKINGS_PER_SHIFT ? "Còn chỗ" : "Hết chỗ"
            });

            return shifts;
        }


        private TimeSpan GetDefaultTimeSlotForShift(int shift)
        {
            return shift switch
            {
                1 => new TimeSpan(8, 0, 0), // Ca 1: 8:00
                2 => new TimeSpan(13, 0, 0), // Ca 2: 13:00
                _ => new TimeSpan(8, 0, 0) // Mặc định 8:00
            };
        }

        public async Task<TestServiceRecordDetailDTO> UpdateTestResultAsync(UpdateTestResultDTO request, int staffId)
        {
            var testServiceRecord = await _context.TestServiceRecords
                .Include(r => r.Staff)
                .FirstOrDefaultAsync(x => x.TestServiceRecordId == request.TestServiceRecordId && x.StaffId == staffId);

            if (testServiceRecord == null)
                throw new ArgumentException("Không tìm thấy bản ghi xét nghiệm .");

            if (testServiceRecord.Status == "Đã hủy")
                throw new ArgumentException("Không thể cập nhật bản ghi xét nghiệm đã bị hủy.");

            testServiceRecord.Result = request.Result;
            testServiceRecord.Notes = request.Notes;
            
            string notificationContent = "";
            bool statusChanged = request.Status != testServiceRecord.Status;
            bool notesChanged = !string.IsNullOrEmpty(request.Notes) && request.Notes != testServiceRecord.Notes;

            if (statusChanged)
            {
                testServiceRecord.Status = request.Status;
                switch (request.Status)
                {
                    case "Dang thuc hien":
                        notificationContent = "Xét nghiệm của bạn đang được thực hiện.";
                        break;
                    case "Da hoan thanh":
                        notificationContent = "Kết quả xét nghiệm của bạn đã có sẵn.";
                        break;
                    case "Khach hang khong den":
                        notificationContent = "Bản xét nghiệm của bạn đã quá hạn.";
                        break;
                    case "Da huy":
                        notificationContent = "Xét nghiệm của bạn đã bị hủy.";
                        break;
                }
            }
            
            if (notesChanged)
            {
                notificationContent = "Bác sĩ đã cập nhật thông tin xét nghiệm của bạn.";
            }
            await _context.SaveChangesAsync();

            if (testServiceRecord.MemberId.HasValue && !string.IsNullOrEmpty(notificationContent))
            {
                var Notification = new Notification
                {
                    UserId = testServiceRecord.MemberId.Value,
                    Title = "Cập nhật thông tin xét nghiệm",
                    Content = notificationContent,
                    SendTime = DateTime.UtcNow.AddHours(7),///////////
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