using System;
using System.Threading.Tasks;
using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Services
{
    public class WeeklyOverrideScheduleService : IWeeklyOverrideSchedule
    {
        private readonly AppDbContext _context;
        public WeeklyOverrideScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WeeklyOverrideScheduleDTO> CreateAsync(CreateWeeklyOverrideScheduleDTO dto)
        {
            var today = DateTime.Today;
            if ((dto.Date.Date - today).TotalDays < 14)
            {
                throw new ArgumentException("vui lòng đăng kí lịch nghỉ sớm trước 2 tuần");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
            if (user == null)
            {
                throw new ArgumentException("Người dùng không tồn tại.");
            }

            if (user.RoleId == "ST")
            {
                var targetDate = DateOnly.FromDateTime(dto.Date);
                var hasTest = await _context.TestServiceRecords
                    .AnyAsync(t => t.StaffId == dto.UserId && t.TestDate != null && t.TestDate == targetDate);
                if (hasTest)
                {
                    throw new ArgumentException("Bạn không thể đăng ký nghỉ vì đã có lịch xét nghiệm trong ngày này.");
                }
            }
            else if (user.RoleId == "CS")
            {
                var hasAppointment = await _context.Appointments.
                    AnyAsync(a => a.ConsultantId == dto.UserId && a.StartTime != null &&
                        a.StartTime.Value.Date == dto.Date.Date);
                if (hasAppointment)
                {
                    throw new ArgumentException("Bạn không thể đăng ký nghỉ vì đã có lịch tư vấn trong ngày này.");
                }
            }

            var existedOverride = await _context.WeeklyOverrideSchedules.
                AnyAsync(ov =>
                ov.UserId == dto.UserId &&
                ov.Date.Date == dto.Date.Date &&
                ov.ShiftType == dto.ShiftType &&
                ov.Status != "Đã hủy");
            if (existedOverride)
            {
                throw new ArgumentException("Bạn đã có đăng ký nghỉ hoặc làm thêm cho ca này trong ngày này rồi vui lòng kiểm tra hoặc hủy để đăng kí lại.");
            }

            if (dto.OverrideType == "Làm thêm")
            {
                var shifts = await GetActualShiftsForUserOnDate(dto.UserId, dto.Date);
                var allPossibleShifts = new HashSet<int> { 1, 2 };
                var availableShifts = allPossibleShifts.Except(shifts).ToList();

                if (dto.ShiftType == 3)
                {
                    if (availableShifts.Count == 2)
                    {
                    }
                    else if (availableShifts.Count == 1)
                    {
                        throw new ArgumentException($"Bạn chỉ có thể đăng ký làm thêm ca {availableShifts[0]} ngày {dto.Date:dd/MM/yyyy}");
                    }
                    else
                    {
                        throw new ArgumentException("Bạn không thể đăng ký làm thêm cả ngày vì đã có ca làm.");
                    }
                }
                else if (dto.ShiftType == 1 || dto.ShiftType == 2)
                {
                    if (!availableShifts.Contains(dto.ShiftType.Value))
                    {
                        throw new ArgumentException($"Bạn đã có lịch làm việc ca {dto.ShiftType} trong ngày này, không thể đăng ký làm thêm ca này.");
                    }
                }
                else
                {
                    throw new ArgumentException("Ca làm thêm không hợp lệ. Chỉ chấp nhận ca 1, ca 2 hoặc cả ngày (3).");
                }
            }
            else
            {
                var shift = await GetActualShiftsForUserOnDate(dto.UserId, dto.Date);
                if (dto.ShiftType == 3)
                {
                    if (shift.Count == 1)
                    {
                        throw new ArgumentException($"Bạn chỉ có thể đăng ký { dto.OverrideType } ca {shift.First()} ngày {dto.Date:dd/MM/yyyy}");
                    }
                    if (shift.Count == 0)
                    {
                        throw new ArgumentException("Bạn chỉ có thể đăng ký nghỉ vào ngày có ca làm việc.");
                    }
                }
                else
                {
                    if (!shift.Contains(dto.ShiftType ?? 0))
                    {
                        throw new ArgumentException("Bạn chỉ có thể đăng ký nghỉ vào ngày có ca làm việc.");
                    }
                }
            }

            var entity = new WeeklyOverrideSchedule
            {
                UserId = dto.UserId,
                Date = dto.Date.Date,
                OverrideType = dto.OverrideType,
                Reason = dto.Reason,
                ShiftType = dto.ShiftType,
                Status = "Đang chờ duyệt"
            };
            _context.WeeklyOverrideSchedules.Add(entity);
            await _context.SaveChangesAsync();

            string title = "Đơn đăng ký nghỉ và làm thêm";
            string content = $"Đơn đăng ký {entity.OverrideType?.ToLower()} của bạn đã được gửi đến Manager.";

            var notification = new Notification
            {
                UserId = entity.UserId,
                Title = title,
                Content = content,
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            _context.Notifications.Add(notification);

            var managerIds = _context.Users
                .Where(u => u.RoleId == "MG")
                .Select(u => u.UserId)
                .ToList();
            string managerTitle = $"Yêu cầu duyệt đơn nghỉ và làm thêm";
            string managerContent = $"Có đơn đăng ký {entity.OverrideType?.ToLower()} mới cần duyệt.";
            foreach (var managerId in managerIds)
            {
                var managerNotification = new Notification
                {
                    UserId = managerId,
                    Title = managerTitle,
                    Content = managerContent,
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false
                };
                _context.Notifications.Add(managerNotification);
            }

            await _context.SaveChangesAsync();

            return new WeeklyOverrideScheduleDTO
            {
                WeeklyOverrideScheduleId = entity.WeeklyOverrideScheduleId,
                UserId = entity.UserId,
                Date = entity.Date,
                OverrideType = entity.OverrideType,
                Reason = entity.Reason,
                ShiftType = entity.ShiftType,
                Status = entity.Status
            };
        }

        public async Task<List<WeeklyOverrideScheduleDTO>> GetListAsync(int? userId = null, string? status = null, string? overrideType = null, DateTime? fromDate = null, DateTime? toDate = null, int? shiftType = null)
        {
            var query = _context.WeeklyOverrideSchedules.Include(x => x.User).AsQueryable();
            if (userId.HasValue)
                query = query.Where(x => x.UserId == userId.Value);
            if (!string.IsNullOrEmpty(status))
                query = query.Where(x => x.Status == status);
            if (!string.IsNullOrEmpty(overrideType))
                query = query.Where(x => x.OverrideType == overrideType);
            if (fromDate.HasValue)
                query = query.Where(x => x.Date >= fromDate.Value.Date);
            if (toDate.HasValue)
                query = query.Where(x => x.Date <= toDate.Value.Date);
            if (shiftType.HasValue)
                query = query.Where(x => x.ShiftType == shiftType.Value);

            var list = await query.OrderByDescending(x => x.Date).ToListAsync();
            return list.Select(x => new WeeklyOverrideScheduleDTO
            {
                WeeklyOverrideScheduleId = x.WeeklyOverrideScheduleId,
                UserId = x.UserId,
                Date = x.Date,
                OverrideType = x.OverrideType,
                Reason = x.Reason,
                ShiftType = x.ShiftType,
                Status = x.Status,
                UserName = x.User?.FullName,
                RoleName = x.User?.RoleId
            }).ToList();
        }

        public async Task<bool> UpdateStatusAsync(UpdateOverrideStatusDTO dto)
        {
            var entity = await _context.WeeklyOverrideSchedules.FirstOrDefaultAsync(x => x.WeeklyOverrideScheduleId == dto.WeeklyOverrideScheduleId);
            if (entity == null)
                throw new ArgumentException("Không tìm thấy đăng ký nghỉ/làm thêm.");
            if (dto.Status != "Đã xác nhận" && dto.Status != "Đã từ chối" && dto.Status != "Đã hủy")
                throw new ArgumentException("Trạng thái không hợp lệ. Chỉ chấp nhận 'Đã xác nhận', 'Đã từ chối' hoặc 'Đã hủy'.");
            if ((entity.Status == "Đã xác nhận" || entity.Status == "Đã từ chối") && dto.Status == "Đã hủy")
                throw new ArgumentException("Không thể hủy đăng ký đã được duyệt hoặc từ chối.");
            if ((entity.Status == "Đã xác nhận" || entity.Status == "Đã từ chối") && dto.Status != entity.Status)
                throw new ArgumentException("Đăng ký này đã được duyệt, không thể cập nhật trạng thái nữa.");
            entity.Status = dto.Status;
            await _context.SaveChangesAsync();

            string title = "Cập nhật đăng ký nghỉ và làm thêm";
            string content = dto.Status == "Đã hủy"
                ? $"Đơn đăng ký {entity.OverrideType?.ToLower()} của bạn đã được hủy."
                : $"Đơn đăng ký {entity.OverrideType?.ToLower()} của bạn đã được Manager phản hồi.";

            var notification = new Notification
            {
                UserId = entity.UserId,
                Title = title,
                Content = content,
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int weeklyOverrideScheduleId)
        {
            var entity = await _context.WeeklyOverrideSchedules.FirstOrDefaultAsync(x => x.WeeklyOverrideScheduleId == weeklyOverrideScheduleId);
            if (entity == null)
                throw new ArgumentException("Không tìm thấy đăng ký nghỉ/làm thêm.");
            if (entity.Status != "Đã hủy")
                throw new ArgumentException("Chỉ có thể xóa đăng ký khi trạng thái là 'Đã hủy'.");
            _context.WeeklyOverrideSchedules.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<HashSet<int>> GetActualShiftsForUserOnDate(int userId, DateTime date)
        {
            var dayOfWeek = (int)date.DayOfWeek;
            var shift = new HashSet<int>();
            shift.UnionWith(await _context.WeeklySchedules
                .Where(ws => ws.UserId == userId && ws.DayOfWeek == dayOfWeek)
                .Select(ws => ws.ShiftType)
                .ToListAsync());
                
            shift.UnionWith(await _context.WeeklyOverrideSchedules
                .Where(ov => ov.UserId == userId
                    && ov.Date.Date == date.Date
                    && ov.OverrideType == "Làm thêm"
                    && ov.Status == "Đã xác nhận")
                .Select(ov => ov.ShiftType ?? 0)
                .ToListAsync());
            shift.Remove(0);
            return shift;
        }
    }
} 