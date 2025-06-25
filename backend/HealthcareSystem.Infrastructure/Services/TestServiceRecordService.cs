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
        const int MAX_TESTS_PER_STAFF = 8;
        const int MAX_TESTS_PER_HOUR_PER_STAFF = 2;
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
            var shiftStartTime = GetDefaultTimeSlotForShift(shift);
            var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);

            var existingUserBookingInShift = await _context.TestServiceRecords
                .AnyAsync(r => r.TestDate == testDate && 
                           r.MemberId == request.UserId &&
                           r.Status != "Da huy" && 
                           r.Status != "Khach hang khong den" &&
                           r.TimeSlot >= shiftStartTime && r.TimeSlot < shiftEndTime);

            if (existingUserBookingInShift)
            {
                return false; 
            }

            var availableStaffIds = await GetAvailableStaffForShiftAsync(testDate, shift);
            if (!availableStaffIds.Any())
            {
                return false;
            }
            
            var staffBookingCounts = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate &&
                            r.StaffId.HasValue &&
                            availableStaffIds.Contains(r.StaffId.Value) &&
                            r.TimeSlot >= shiftStartTime && r.TimeSlot < shiftEndTime &&
                            r.Status != "Da huy" && r.Status != "Khach hang khong den")
                .GroupBy(r => r.StaffId.Value)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
            
            foreach (var staffId in availableStaffIds)
            {
                if (staffBookingCounts.GetValueOrDefault(staffId, 0) < MAX_TESTS_PER_STAFF)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var testDate = request.TestDate;
            var shift = request.Shift;

            if (shift != 1 && shift != 2)
            {
                throw new ArgumentException("Ca làm việc không hợp lệ. Chỉ chấp nhận ca 1 hoặc ca 2.");
            }
            var shiftStartTime = GetDefaultTimeSlotForShift(shift);
            var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);

            var existingUserBookingInShift = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate && 
                           r.MemberId == request.UserId &&
                           r.Status != "Da huy" && 
                           r.Status != "Khach hang khong den" &&
                           r.TimeSlot >= shiftStartTime && r.TimeSlot < shiftEndTime)
                .FirstOrDefaultAsync(); 

            if (existingUserBookingInShift != null)
            {
                throw new ArgumentException($"Bạn đã có lịch xét nghiệm vào ca này ngày {request.TestDate.ToString("dd/MM/yyyy")}. " +
                    "Mỗi khách hàng chỉ có thể đặt 1 lịch xét nghiệm mỗi ca.");
            }

            var availableStaffIds = await GetAvailableStaffForShiftAsync(testDate, shift);

            if (!availableStaffIds.Any())
            {
                 throw new ArgumentException($"Rất tiếc, ca bạn chọn trong ngày {request.TestDate.ToString("dd/MM/yyyy")} không có nhân viên làm việc. " +
                    "Quý khách vui lòng chọn ca khác hoặc ngày khác phù hợp hơn.");
            }
            
            var staffBookingCounts = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate &&
                            r.StaffId.HasValue &&
                            availableStaffIds.Contains(r.StaffId.Value) &&
                            r.TimeSlot >= shiftStartTime && r.TimeSlot < shiftEndTime &&
                            r.Status != "Da huy" && r.Status != "Khach hang khong den")
                .GroupBy(r => r.StaffId.Value)
                .ToDictionaryAsync(g => g.Key, g => g.Count());

            int? selectedStaffId = null;
            int minBookings = int.MaxValue;

            foreach (var staffId in availableStaffIds)
            {
                int currentBookings = staffBookingCounts.GetValueOrDefault(staffId, 0);
                if (currentBookings < MAX_TESTS_PER_STAFF)
                {
                    if (currentBookings < minBookings)
                    {
                        minBookings = currentBookings;
                        selectedStaffId = staffId;
                    }
                }
            }
             if (selectedStaffId == null)
            {
                var totalCapacity = availableStaffIds.Count * MAX_TESTS_PER_STAFF;
                throw new ArgumentException($"Rất tiếc, ca bạn chọn trong ngày {request.TestDate.ToString("dd/MM/yyyy")} " +
                            $"đã đạt giới hạn số lượng đặt lịch ({totalCapacity} ca). " +
                            "Quý khách vui lòng chọn ca khác hoặc ngày khác phù hợp hơn.");
            }

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
                TimeSlot = shiftStartTime,
                RecordDate = DateTime.UtcNow.AddHours(7), 
                Result = "",
                StaffId = selectedStaffId, 
                Notes = ""
            };

            _context.TestServiceRecords.Add(testServiceRecord);
            await _context.SaveChangesAsync();

            return testServiceRecord.TestServiceRecordId;
        }

        public async Task<IEnumerable<WorkShiftDTO>> GetWorkShiftsAsync(DateOnly date)
        {
            var shifts = new List<WorkShiftDTO>();

            // 1. Xử lý các ca làm việc chuẩn (Ca 1, Ca 2)
            for (int shift = 1; shift <= 2; shift++)
            {
                var availableStaffIds = await GetAvailableStaffForShiftAsync(date, shift);
                if (availableStaffIds.Any())
                {
                    var maxBookings = availableStaffIds.Count * MAX_TESTS_PER_STAFF;
                    var shiftStartTime = GetDefaultTimeSlotForShift(shift);
                    var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);

                    var currentBookings = await _context.TestServiceRecords
                        .CountAsync(r => r.TestDate == date &&
                                         (r.Status == "Dang cho kham") &&
                                         r.TimeSlot >= shiftStartTime &&
                                         r.TimeSlot < shiftEndTime);

                    shifts.Add(new WorkShiftDTO
                    {
                        ShiftId = shift,
                        ShiftName = $"Ca {shift}",
                        StartTime = shiftStartTime.ToString(@"hh\:mm"),
                        EndTime = shiftEndTime.ToString(@"hh\:mm"),
                        CurrentBookings = currentBookings,
                        MaxBookings = maxBookings,
                        IsAvailable = currentBookings < maxBookings,
                        Status = currentBookings < maxBookings ? "Còn chỗ" : "Hết chỗ"
                    });
                }
            }

            // 2. Xử lý các ca làm thêm
            var defaultExtraShiftStartTime = new TimeSpan(17, 0, 0);

            var extraShiftOverrides = await _context.WeeklyOverrideSchedules
                .Where(os => DateOnly.FromDateTime(os.Date) == date &&
                               os.OverrideType == "Làm thêm" &&
                               os.NewEndTime.HasValue &&
                               os.NewEndTime.Value > defaultExtraShiftStartTime) 
                .ToListAsync();

            var groupedByEndTime = extraShiftOverrides.GroupBy(os => os.NewEndTime.Value);
            
            foreach (var group in groupedByEndTime)
            {
                var startTime = defaultExtraShiftStartTime;
                var endTime = group.Key;
                var staffInExtraShift = group.Select(os => os.UserId).ToList();

                var durationInHours = (endTime - startTime).TotalHours;
                var maxBookings = (int)(staffInExtraShift.Count * durationInHours * MAX_TESTS_PER_HOUR_PER_STAFF);
                
                var currentBookings = await _context.TestServiceRecords
                    .CountAsync(r => r.TestDate == date &&
                                     (r.Status == "Dang cho kham") &&
                                     r.TimeSlot >= startTime &&
                                     r.TimeSlot < endTime);
                
                shifts.Add(new WorkShiftDTO
                {
                    ShiftId = endTime.Hours * 100 + endTime.Minutes,
                    ShiftName = $"Ca làm thêm ({startTime:hh\\:mm} - {endTime:hh\\:mm})",
                    StartTime = startTime.ToString(@"hh\:mm"),
                    EndTime = endTime.ToString(@"hh\:mm"),
                    CurrentBookings = currentBookings,
                    MaxBookings = maxBookings,
                    IsAvailable = currentBookings < maxBookings,
                    Status = currentBookings < maxBookings ? "Còn chỗ" : "Hết chỗ"
                });
            }

            return shifts;
        }


        private TimeSpan GetDefaultTimeSlotForShift(int shift)
        {
            if (shift == 1)
                return new TimeSpan(8, 0, 0); 
            else if (shift == 2)
                return new TimeSpan(13, 0, 0); 
            else
                throw new ArgumentException("Ca làm việc không hợp lệ. Chỉ chấp nhận ca 1 hoặc ca 2.");
        }

        public async Task<List<int>> GetAvailableStaffForShiftAsync(DateOnly date, int shift)
        {
            var dayOfWeek = (int)date.DayOfWeek;

            var overrides = await _context.WeeklyOverrideSchedules
                .Where(os => DateOnly.FromDateTime(os.Date) == date)
                .ToListAsync();

            // Logic for standard shifts (1 and 2)
            if (shift == 1 || shift == 2)
            {
                var regularStaffIds = await _context.WeeklySchedules
                    .Where(ws => ws.DayOfWeek == dayOfWeek && ws.ShiftType == shift && ws.User.IsAvailable)
                    .Select(ws => ws.UserId)
                    .ToListAsync();
                
                var staffOnLeave = overrides
                    .Where(o => o.OverrideType == "Nghỉ" && (o.ShiftType == shift || o.ShiftType == 3))
                    .Select(o => o.UserId);

                return regularStaffIds.Except(staffOnLeave).Distinct().ToList();
            }
            
            return new List<int>(); // Should not happen
        }

        private async Task<int> GetMaxBookingsForShiftAsync(DateOnly date, int shift)
        {
             var availableStaff = await GetAvailableStaffForShiftAsync(date, shift);
            return availableStaff.Count * MAX_TESTS_PER_STAFF;
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