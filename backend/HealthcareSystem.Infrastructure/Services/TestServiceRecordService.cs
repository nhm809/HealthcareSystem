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
                    StaffId = r.StaffId,
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
                    ServiceName = r.Service.Name,
                    r.MemberId,
                    r.Result,
                    r.RecordDate,
                    r.Notes,
                    r.Status,
                    r.StaffId,
                    r.TestDate,
                    r.TimeSlot,
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
                ServiceName = record.ServiceName,
                Result = record.Result,
                RecordDate = record.RecordDate,
                Notes = record.Notes,
                Status = record.Status,
                TestDate = record.TestDate,
                TimeSlot = record.TimeSlot,
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

            var shiftStartTime = GetDefaultTimeSlotForShift(shift);
            var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);

            var availableStaffIds = await GetAvailableStaffIdsForShiftAsync(testDate, shift);
            var shiftDurationHours = (shiftEndTime - shiftStartTime).TotalHours;
            var maxBookings = (int)(availableStaffIds.Count * shiftDurationHours * MAX_TESTS_PER_HOUR_PER_STAFF);


            var currentBookings = await _context.TestServiceRecords
                .CountAsync(r => r.TestDate == testDate &&
                                 (r.Status == "Dang cho kham") &&
                                 r.TimeSlot >= shiftStartTime &&
                                 r.TimeSlot < shiftEndTime);

            return currentBookings < maxBookings;
        }
        
        public async Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var testDate = request.TestDate;
            var shift = request.Shift;

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
                throw new ArgumentException($"Bạn đã có lịch xét nghiệm vào ca này ngày {request.TestDate.ToString("dd/MM/yyyy")}. " +
                    "Mỗi khách hàng chỉ có thể đặt 1 lịch xét nghiệm mỗi ca.");
            }


            var canBook = await CanBookTestService(request);
            if (!canBook)
            {
                 throw new ArgumentException($"Rất tiếc, ca bạn chọn trong ngày {request.TestDate.ToString("dd/MM/yyyy")} đã hết chỗ. " +
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
                StaffId = null,
                Notes = ""
            };

            _context.TestServiceRecords.Add(testServiceRecord);
            await _context.SaveChangesAsync();

            return testServiceRecord.TestServiceRecordId;
        }

        public async Task AssignStaffToTestRecordAsync(int testServiceRecordId)
        {
            var record = await _context.TestServiceRecords
                .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId);

            if (record == null || record.StaffId.HasValue)
            {
                return;
            }

            if (!record.TestDate.HasValue)
            {
                record.Notes += " [Lỗi hệ thống: Bản ghi thiếu ngày xét nghiệm, không thể phân công.]";
                await _context.SaveChangesAsync();
                return;
            }

            var testDate = record.TestDate.Value;
            var shift = (record.TimeSlot < new TimeSpan(12, 0, 0)) ? 1 : 2;

            var availableStaffIds = await GetAvailableStaffIdsForShiftAsync(testDate, shift);

            if (!availableStaffIds.Any())
            {
                record.Notes += " [Lỗi hệ thống: Không tìm thấy nhân viên phù hợp để phân công.]";
                await _context.SaveChangesAsync();
                return;
            }

            // round robin
            var shiftStartTime = GetDefaultTimeSlotForShift(shift);
            var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);
            
            var assignedRecordsInShift = await _context.TestServiceRecords
                .Where(r => r.TestDate == testDate &&
                            r.StaffId.HasValue &&
                            availableStaffIds.Contains(r.StaffId.Value) &&
                            r.TimeSlot >= shiftStartTime && r.TimeSlot < shiftEndTime &&
                            r.Status != "Da huy" && r.Status != "Khach hang khong den")
                .OrderBy(r => r.TestServiceRecordId)
                .ToListAsync();
            
            int assignedCount = assignedRecordsInShift.Count;
            int staffIndex = assignedCount % availableStaffIds.Count;
            int selectedStaffId = availableStaffIds[staffIndex];

            record.StaffId = selectedStaffId;
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<WorkShiftDTO>> GetWorkShiftsAsync(DateOnly date)
        {
            var shifts = new List<WorkShiftDTO>();

            for (int shift = 1; shift <= 2; shift++)
            {
                var shiftStartTime = GetDefaultTimeSlotForShift(shift);
                var shiftEndTime = (shift == 1) ? new TimeSpan(12, 0, 0) : new TimeSpan(17, 0, 0);

                var availableStaffIds = await GetAvailableStaffIdsForShiftAsync(date, shift);
                
                if (availableStaffIds.Any())
                {
                    var shiftDurationHours = (shiftEndTime - shiftStartTime).TotalHours;
                    var maxBookings = (int)(availableStaffIds.Count * shiftDurationHours * MAX_TESTS_PER_HOUR_PER_STAFF);

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
            return await GetAvailableStaffIdsForShiftAsync(date, shift);
        }

        private async Task<List<int>> GetAvailableStaffIdsForShiftAsync(DateOnly date, int shift)
        {
            var dayOfWeek = (int)date.DayOfWeek;

            var regularStaffIds = await _context.WeeklySchedules
                .Include(ws => ws.User)
                .Where(ws => ws.DayOfWeek == dayOfWeek && ws.ShiftType == shift && ws.User.IsAvailable && ws.User.RoleId == "ST")
                .Select(ws => ws.UserId)
                .ToListAsync();

            var overrides = await _context.WeeklyOverrideSchedules
                .Include(os => os.User)
                .Where(os => DateOnly.FromDateTime(os.Date) == date && os.Status == "Đã xác nhận" && os.User.RoleId == "ST")
                .ToListAsync();

            var staffOnLeaveIds = overrides
                .Where(o => o.OverrideType == "Nghỉ" && (o.ShiftType == shift || o.ShiftType == 3))
                .Select(o => o.UserId)
                .ToHashSet();


            var extraWorkStaffIds = overrides
                .Where(o => o.OverrideType == "Làm thêm" && o.ShiftType == shift)
                .Select(o => o.UserId)
                .ToList();

            var availableStaffIds = new HashSet<int>(regularStaffIds);
            availableStaffIds.UnionWith(extraWorkStaffIds);
            availableStaffIds.ExceptWith(staffOnLeaveIds);

            //Console.WriteLine("Available staff for {0} ca {1}: {2}", date, shift, string.Join(",", availableStaffIds));

            return availableStaffIds.OrderBy(id => id).ToList();
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
            bool resultChanged = !string.IsNullOrEmpty(request.Result) && request.Result != oldResult;

            testServiceRecord.Status = request.Status;
            if (!string.IsNullOrEmpty(request.Notes))
            {
                testServiceRecord.Notes = request.Notes;
            }
            if (!string.IsNullOrEmpty(request.Result))
            {
                testServiceRecord.Result = request.Result;
            }

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
                TestDate = testServiceRecord.TestDate,
                TimeSlot = testServiceRecord.TimeSlot,
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
            }else if (testServiceRecord.Status == "Da hoan thanh" || testServiceRecord.Status == "Da danh gia")
            {
                throw new ArgumentException("Xét nghiệm đã hoàn thành.");
            }else if (testServiceRecord.Status == "Dang cho kham")
            {
                throw new ArgumentException("Xét nghiệm đang trong quá trình chờ khám");
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

        public async Task<IEnumerable<TestServiceRecordStaffDTO>> GetTestServiceRecordByStatusAsync(string status)
        {
            return await _context.TestServiceRecords
                .Where(r => r.Status == status)
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
                    Dob =r.Dob,
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