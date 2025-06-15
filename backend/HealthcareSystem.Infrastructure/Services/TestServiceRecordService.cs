using Application.DTOs;
using Domain.Entities;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using HealthcareSystem.Application.DTOs;
using System.Text.RegularExpressions;
using HealthcareSystem.Application.Interfaces;
namespace Infrastructure.Services
{
    
    public class TestServiceRecordService : ITestServiceRecord
    {
        const int FIXED_SERVICE_ID = 1;
        const int Number_TestOnDate = 80;
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
        
        public async Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrWhiteSpace(request.FullName))
                throw new ArgumentException("Họ và tên không được để trống.");

            if (request.Dob > DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("Ngày sinh không hợp lệ");

            
            if(string.IsNullOrWhiteSpace(request.Gender)){
                throw new ArgumentException("Vui lòng chọn giới tính");
            }
            if(request.TestDate <= DateOnly.FromDateTime(DateTime.Now)){
                throw new ArgumentException("Ngày khám không hợp lệ ");
            }

            if (!Regex.IsMatch(request.PhoneNumber, @"^0\d{9}$"))
                throw new ArgumentException("Số điện thoại không hợp lệ.");

            
            var numberOfTestsOnDate = await _context.TestServiceRecords
                .CountAsync(x => x.TestDate == request.TestDate);
            
            if (numberOfTestsOnDate >= Number_TestOnDate)
            {
                throw new ArgumentException("Rất tiếc, ngày " + request.TestDate.ToString("dd/MM/yyyy") + 
                " đã đạt giới hạn số lượng đặt lịch. Để đảm bảo chất lượng phục vụ tốt nhất,"
                +"chúng tôi chỉ nhận tối đa " +Number_TestOnDate+" ca xét nghiệm mỗi ngày."
                +" Quý khách vui lòng chọn ngày khác phù hợp hơn.");
            }

            
            

            var testServiceRecord = new TestServiceRecord
            {
                ServiceId = FIXED_SERVICE_ID,
                FullNameOfMember = request.FullName,
                Dob = request.Dob,
                TestDate = request.TestDate,
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MemberId = request.UserId, // UserId do FE quản lý
                Status = "Dang thanh toan",
                RecordDate = DateTime.UtcNow.AddHours(7), // UTC+7 cho Việt Nam
                Result = "",
                StaffId = null, 
                Notes = ""
            };

            _context.TestServiceRecords.Add(testServiceRecord);
            await _context.SaveChangesAsync();

            return testServiceRecord.TestServiceRecordId;
        }

        public async Task<UpdateTestServiceRecordDTO> SelectTestServiceRecordAsync(int testServiceRecordId, int staffId)
        {
            var testServiceRecord = await _context.TestServiceRecords
                .FirstOrDefaultAsync(x => x.TestServiceRecordId == testServiceRecordId);

            if(testServiceRecord.Status != "Dang cho kham")
                throw new ArgumentException("Bản ghi xét nghiệm chưa đủ điều kiện để thực hiện");

            if (testServiceRecord == null)
                throw new ArgumentException("Không tìm thấy bản ghi xét nghiệm này.");

            
            if (testServiceRecord.StaffId == staffId)
                throw new ArgumentException("Bạn đang thực hiện bản xét nghiệm này.");
            else if (testServiceRecord.StaffId != null && testServiceRecord.StaffId != staffId)
                throw new ArgumentException("Bản ghi xét nghiệm đã được thực hiện bởi nhân viên khác.");

            testServiceRecord.StaffId = staffId;
            await _context.SaveChangesAsync();

            return new UpdateTestServiceRecordDTO
            {
                TestServiceRecordId = testServiceRecord.TestServiceRecordId,
                StaffId = staffId
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

            Console.WriteLine($"Status changed: {statusChanged}, Notes changed: {notesChanged}");
            Console.WriteLine($"Old status: {testServiceRecord.Status}, New status: {request.Status}");

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