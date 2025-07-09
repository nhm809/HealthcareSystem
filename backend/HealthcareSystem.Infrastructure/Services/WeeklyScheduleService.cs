using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using Infrastructure.data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthcareSystem.Infrastructure.Services
{
    public class WeeklyScheduleService : IWeeklyScheduleService
    {
        private readonly AppDbContext _context;
        private readonly Notification _notificationService;

        public WeeklyScheduleService(AppDbContext context)
        {
            _context = context;
            _notificationService = new Notification(); 
        }

        public async Task<WeeklyScheduleDTO> CreateWeeklyScheduleAsync(CreateWeeklyScheduleDTO createDto)
        {
            Console.WriteLine($"CreateWeeklyScheduleAsync called with: UserId={createDto.UserId}, DayOfWeek={createDto.DayOfWeek}, ShiftType={createDto.ShiftType}");
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == createDto.UserId && 
                                         (u.RoleId == "ST" || u.RoleId == "CS"));

            Console.WriteLine($"User found: {user?.UserId}, Role: {user?.RoleId}");

            if (user == null)
            {
                throw new ArgumentException("Người dùng không phải là Tư vấn viên/Bác sĩ hoặc không tồn tại");
            }

            if (createDto.DayOfWeek < 0 || createDto.DayOfWeek > 6)
            {
                throw new ArgumentException("Ngày trong tuần không hợp lệ");
            }

            if (createDto.ShiftType < 1 || createDto.ShiftType > 2)
            {
                throw new ArgumentException("Ca làm việc phù hợp là ca 1 và ca 2");
            }

            var existingSchedule = await _context.WeeklySchedules
                .FirstOrDefaultAsync(ws => ws.UserId == createDto.UserId && 
                                          ws.DayOfWeek == createDto.DayOfWeek && 
                                          ws.ShiftType == createDto.ShiftType);

            if (existingSchedule != null)
            {
                throw new ArgumentException("Lịch làm việc này đã tồn tại với người dùng");
            }

            TimeSpan startTime, endTime;
            
            if (createDto.ShiftType == 1)  
            {
                startTime = new TimeSpan(8, 0, 0);  
                endTime = new TimeSpan(12, 0, 0);   
            }
            else 
            {
                startTime = new TimeSpan(13, 0, 0);  
                endTime = new TimeSpan(17, 0, 0);    
            }

            var weeklySchedule = new WeeklySchedule
            {
                UserId = createDto.UserId,
                DayOfWeek = createDto.DayOfWeek,
                StartTime = startTime,
                EndTime = endTime,
                ShiftType = createDto.ShiftType,
                Note = createDto.Note
            };
            _context.WeeklySchedules.Add(weeklySchedule);
            await _context.SaveChangesAsync();

            var dayNames = new[] { "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" };
            var shiftNames = new[] { "", "Sáng", "Chiều" };
            
            var Notification = new Notification
            {
                UserId = createDto.UserId,
                Title = "Lịch làm việc mới",
                Content = $"Bạn đã được thêm vào lịch làm việc thường xuyên: {dayNames[createDto.DayOfWeek]} ca {shiftNames[createDto.ShiftType]} ({startTime:hh\\:mm} - {endTime:hh\\:mm}). Vui lòng kiểm tra ở mục lịch làm việc của bạn.",
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            _context.Notifications.Add(Notification);
            await _context.SaveChangesAsync();

            

            return new WeeklyScheduleDTO
            {
                WeeklyScheduleId = weeklySchedule.WeeklyScheduleId,
                UserId = weeklySchedule.UserId,
                DayOfWeek = weeklySchedule.DayOfWeek,
                StartTime = weeklySchedule.StartTime,
                EndTime = weeklySchedule.EndTime,
                ShiftType = weeklySchedule.ShiftType,
                Note = weeklySchedule.Note
            };
        }

        public async Task<bool> DeleteWeeklyScheduleAsync(int weeklyScheduleId)
        {
            var weeklySchedule = await _context.WeeklySchedules
                .Include(ws => ws.User)
                .FirstOrDefaultAsync(ws => ws.WeeklyScheduleId == weeklyScheduleId);
                
            if (weeklySchedule == null)
            {
                return false;
            }
            
            _context.WeeklySchedules.Remove(weeklySchedule);
            await _context.SaveChangesAsync();

            // Tạo thông báo rõ ràng cho Staff/Consultant
            var dayNames = new[] { "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" };
            var shiftNames = new[] { "", "ca sáng", "ca chiều" };
            
            var Notification = new Notification
            {
                UserId = weeklySchedule.UserId,
                Title = "Cập nhật lịch làm việc",
                Content = $"Lịch làm việc {dayNames[weeklySchedule.DayOfWeek]} ca {shiftNames[weeklySchedule.ShiftType]} ({weeklySchedule.StartTime:hh\\:mm} - {weeklySchedule.EndTime:hh\\:mm}) đã được xóa khỏi lịch làm việc thường xuyên của bạn.",
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            _context.Notifications.Add(Notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<WeeklyScheduleDTO> UpdateWeeklyScheduleAsync(int weeklyScheduleId, UpdateWeeklyScheduleDTO updateDto)
        {
            var existingSchedule = await _context.WeeklySchedules
                .FirstOrDefaultAsync(ws => ws.WeeklyScheduleId == weeklyScheduleId);

            if (existingSchedule == null)
            {
                throw new ArgumentException("Lịch làm việc không tồn tại");
            }
            if (updateDto.DayOfWeek < 0 || updateDto.DayOfWeek > 6)
            {
                throw new ArgumentException("Ngày trong tuần không hợp lệ");
            }

            if (updateDto.ShiftType < 1 || updateDto.ShiftType > 2)
            {
                throw new ArgumentException("Ca làm việc phù hợp là ca 1 và ca 2");
            }

            var conflictingSchedule = await _context.WeeklySchedules
                .FirstOrDefaultAsync(ws => ws.UserId == existingSchedule.UserId && 
                                          ws.DayOfWeek == updateDto.DayOfWeek && 
                                          ws.ShiftType == updateDto.ShiftType &&
                                          ws.WeeklyScheduleId != weeklyScheduleId);

            if (conflictingSchedule != null)
            {
                throw new ArgumentException("Lịch làm việc này đã tồn tại với người dùng");
            }

            TimeSpan startTime, endTime;
            if (updateDto.ShiftType == 1)
            {
                startTime = new TimeSpan(8, 0, 0);
                endTime = new TimeSpan(12, 0, 0);
            }
            else
            {
                startTime = new TimeSpan(13, 0, 0);
                endTime = new TimeSpan(17, 0, 0);
            }

            existingSchedule.DayOfWeek = updateDto.DayOfWeek;
            existingSchedule.StartTime = startTime;
            existingSchedule.EndTime = endTime;
            existingSchedule.ShiftType = updateDto.ShiftType;
            existingSchedule.Note = updateDto.Note;

            await _context.SaveChangesAsync();

            var dayNames = new[] { "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" };
            var shiftNames = new[] { "", "ca sáng", "ca chiều" };

            var notification = new Notification
            {
                UserId = existingSchedule.UserId,
                Title = "Cập nhật lịch làm việc",
                Content = $"Lịch làm việc của bạn đã được cập nhật: {dayNames[updateDto.DayOfWeek]} {shiftNames[updateDto.ShiftType]} ({startTime:hh\\:mm} - {endTime:hh\\:mm}). Vui lòng kiểm tra ở mục lịch làm việc của bạn.",
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return new WeeklyScheduleDTO
            {
                WeeklyScheduleId = existingSchedule.WeeklyScheduleId,
                UserId = existingSchedule.UserId,
                DayOfWeek = existingSchedule.DayOfWeek,
                StartTime = existingSchedule.StartTime,
                EndTime = existingSchedule.EndTime,
                ShiftType = existingSchedule.ShiftType,
                Note = existingSchedule.Note
            };
        }

        public async Task<List<WeeklyScheduleDTO>> GetWeeklySchedulesByUserIdAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId && 
                                         (u.RoleId == "ST" || u.RoleId == "CS"));

            if (user == null)
            {
                throw new ArgumentException("Người dùng không phải là Tư vấn viên/Bác sĩ hoặc không tồn tại");
            }

            var weeklySchedules = await _context.WeeklySchedules
                .Where(ws => ws.UserId == userId)
                .OrderBy(ws => ws.DayOfWeek)
                .ThenBy(ws => ws.ShiftType)
                .ToListAsync();

            return weeklySchedules.Select(ws => new WeeklyScheduleDTO
            {
                WeeklyScheduleId = ws.WeeklyScheduleId,
                UserId = ws.UserId,
                DayOfWeek = ws.DayOfWeek,
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                ShiftType = ws.ShiftType,
                Note = ws.Note
            }).ToList();
        }

        public async Task<WeeklyScheduleDTO> GetWeeklyScheduleByIdAsync(int weeklyScheduleId)
        {
            var weeklySchedule = await _context.WeeklySchedules
                .FirstOrDefaultAsync(ws => ws.WeeklyScheduleId == weeklyScheduleId);

            if (weeklySchedule == null)
            {
                throw new ArgumentException("Lịch làm việc không tồn tại");
            }

            return new WeeklyScheduleDTO
            {
                WeeklyScheduleId = weeklySchedule.WeeklyScheduleId,
                UserId = weeklySchedule.UserId,
                DayOfWeek = weeklySchedule.DayOfWeek,
                StartTime = weeklySchedule.StartTime,
                EndTime = weeklySchedule.EndTime,
                ShiftType = weeklySchedule.ShiftType,
                Note = weeklySchedule.Note
            };
        }

        public async Task<List<WeeklyScheduleDTO>> SearchWeeklySchedulesAsync(int? userId = null, int? dayOfWeek = null, int? shiftType = null)
        {
            var query = _context.WeeklySchedules.AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(ws => ws.UserId == userId.Value);
            }

            if (dayOfWeek.HasValue)
            {
                if (dayOfWeek.Value < 0 || dayOfWeek.Value > 6)
                {
                    throw new ArgumentException("Ngày trong tuần không hợp lệ");
                }
                query = query.Where(ws => ws.DayOfWeek == dayOfWeek.Value);
            }

            if (shiftType.HasValue)
            {
                if (shiftType.Value < 1 || shiftType.Value > 2)
                {
                    throw new ArgumentException("Ca làm việc phù hợp là ca 1 và ca 2");
                }
                query = query.Where(ws => ws.ShiftType == shiftType.Value);
            }

            query = query.Include(ws => ws.User);

            var weeklySchedules = await query
                .OrderBy(ws => ws.UserId)
                .ThenBy(ws => ws.DayOfWeek)
                .ThenBy(ws => ws.ShiftType)
                .ToListAsync();

            return weeklySchedules.Select(ws => new WeeklyScheduleDTO
            {
                WeeklyScheduleId = ws.WeeklyScheduleId,
                UserId = ws.UserId,
                DayOfWeek = ws.DayOfWeek,
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                ShiftType = ws.ShiftType,
                Note = ws.Note
            }).ToList();
        }
    } 
} 