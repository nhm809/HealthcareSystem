using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.data;
using Domain.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace HealthcareSystem.Infrastructure.BackgroundServices
{
    public class StaffAssignmentService : IHostedService, IDisposable
    {
        private readonly ILogger<StaffAssignmentService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private Timer _timer;

        public StaffAssignmentService(ILogger<StaffAssignmentService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Đang phân lịch xét nghiệm cho Staff bắt đầu.");
            // _timer = new Timer(DoWork, null, TimeSpan.FromSeconds(5), Timeout.InfiniteTimeSpan); // Chạy sau 5 giây để test

            // -chạy định kỳ --
            var now = DateTime.Now;
            var firstRunTime = now.Date.AddHours(6); 
            if (now > firstRunTime)
            {
                firstRunTime = firstRunTime.AddDays(1); 
            }
            var timeUntilFirstRun = firstRunTime - now;
            _timer = new Timer(DoWork, null, timeUntilFirstRun, TimeSpan.FromDays(1));
            
            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
            _logger.LogInformation("Đang phân lịch xét nghiệm cho Staff.");

            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<StaffAssignmentService>>();

                try
                {
                    var today = DateOnly.FromDateTime(DateTime.Today);
                    var FIXED_STAFF_ROLE_ID = "ST";
                    var MAX_TESTS_PER_STAFF_PER_SHIFT = 8;

                    var availableStaffs = await dbContext.Users
                        .Where(u => u.IsAvailable && u.RoleId == FIXED_STAFF_ROLE_ID)
                        .ToListAsync();

                    if (!availableStaffs.Any())
                    {
                        logger.LogWarning("Không có Staff nào có mặt để phân công cho ngày {Today}.", today);
                        return;
                    }

                    var unassignedRecords = await dbContext.TestServiceRecords
                        .Where(r => r.TestDate == today && r.StaffId == null && r.Status == "Dang cho kham")
                        .OrderBy(r => r.TimeSlot)
                        .ToListAsync();

                    if (!unassignedRecords.Any())
                    {
                        logger.LogInformation("Không có TestServiceRecord nào cần phân công cho ngày {Today}.", today);
                        return;
                    }

                    logger.LogInformation("Bắt đầu phân công {Count} TestServiceRecords cho ngày {Today} với {StaffCount} Staff có mặt.", unassignedRecords.Count, today, availableStaffs.Count);

                    // Nhóm records theo ca
                    var recordsByShift = unassignedRecords
                        .GroupBy(r => 
                        {
                            if (!r.TimeSlot.HasValue) return 0;
                            var time = r.TimeSlot.Value;
                            if (time >= new TimeSpan(8, 0, 0) && time < new TimeSpan(12, 0, 0)) return 1;
                            if (time >= new TimeSpan(13, 0, 0) && time < new TimeSpan(17, 0, 0)) return 2;
                            return 0;
                        })
                        .Where(g => g.Key > 0) // Chỉ lấy ca hợp lệ
                        .ToDictionary(g => g.Key, g => g.ToList());

                    foreach (var shiftGroup in recordsByShift)
                    {
                        var shift = shiftGroup.Key;
                        var recordsInShift = shiftGroup.Value;
                        
                        logger.LogInformation("Phân công {Count} records cho Ca {Shift}.", recordsInShift.Count, shift);

                        // Tính toán số lượng tests tối đa per staff cho ca này
                        var totalTestsInShift = recordsInShift.Count;
                        var availableStaffCount = availableStaffs.Count;
                        var maxTestsPerStaff = Math.Min(MAX_TESTS_PER_STAFF_PER_SHIFT, 
                            (int)Math.Ceiling((double)totalTestsInShift / availableStaffCount));

                        logger.LogInformation("Ca {Shift}: {TotalTests} tests, {StaffCount} staff, tối đa {MaxPerStaff} tests/staff.", 
                            shift, totalTestsInShift, availableStaffCount, maxTestsPerStaff);

                        var staffAssignmentCount = new Dictionary<int, int>();
                        foreach (var staff in availableStaffs)
                        {
                            staffAssignmentCount[staff.UserId] = 0;
                        }

                    var currentStaffIndex = 0;

                        foreach (var record in recordsInShift)
                        {
                            var assigned = false;
                            var attempts = 0;

                            while (!assigned && attempts < availableStaffs.Count)
                            {
                                var staffToAssign = availableStaffs[currentStaffIndex];
                                
                                if (staffAssignmentCount[staffToAssign.UserId] < maxTestsPerStaff)
                                {
                                    record.StaffId = staffToAssign.UserId;
                                    staffAssignmentCount[staffToAssign.UserId]++;
                                    logger.LogInformation("Phân công Record ID {RecordId} (Ca {Shift}) cho Staff ID {StaffId}.", 
                                        record.TestServiceRecordId, shift, staffToAssign.UserId);
                                    assigned = true;
                                }

                                currentStaffIndex = (currentStaffIndex + 1) % availableStaffs.Count;
                                attempts++;
                            }

                            if (!assigned)
                            {
                                logger.LogWarning("Không thể phân công Record ID {RecordId} (Ca {Shift}). Tất cả Staff đều đầy.", 
                                    record.TestServiceRecordId, shift);
                            }
                        }
                    }

                    await dbContext.SaveChangesAsync();
                    logger.LogInformation("Hoàn thành phân công Staff cho ngày {Today}.", today);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Lỗi xảy ra trong quá trình phân công Staff.");
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Staff Assignment Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
} 