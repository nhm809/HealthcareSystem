using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;

namespace Infrastructure.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAppointmentAsync(AppointmentCreateDto dto)
        {
            var consultant = await _context.Users.FindAsync(dto.ConsultantId);
            var member = await _context.Users.FindAsync(dto.MemberId);

            var consultantName = consultant?.FullName ?? "chuyên gia";
            var memberName = member?.FullName ?? "người dùng";

            var formattedTime = dto.StartTime.ToString("HH:mm dd/MM/yyyy");

            var entity = new Appointment
            {
                MemberId = dto.MemberId,
                ServiceId = dto.ServiceId,
                ConsultantId = dto.ConsultantId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                MeetLink = dto.MeetLink,
                Status = "Dang thanh toan",   // giá trị mặc định
                Symptoms = dto.Symptoms // Assign the new Symptoms field
            };
            await _context.Appointments.AddAsync(entity);

            var notiForConsultant = new Notification
            {
                UserId = dto.ConsultantId,
                Title = "Lịch hẹn mới",
                Content = $"Bạn có một lịch hẹn mới với {memberName} vào lúc {formattedTime}.",
                SendTime = DateTime.UtcNow.AddHours(7), // Giờ Việt Nam
                IsRead = false
            };

            var notiForMember = new Notification
            {
                UserId = dto.MemberId,
                Title = "Đặt lịch thành công",
                Content = $"Bạn đã đặt lịch hẹn thành công với {consultantName} vào lúc {formattedTime}.",
                SendTime = DateTime.UtcNow.AddHours(7),
                IsRead = false
            };
            await _context.Notifications.AddRangeAsync(notiForConsultant, notiForMember);

            await _context.SaveChangesAsync();
            return entity.AppointmentId;
        }

        public async Task<IEnumerable<AppointmentListItemDto>> GetAllAppointmentsAsync()
        {
            // Lấy danh sách từ DB và project sang DTO
            var list = await _context.Appointments
                .Include(a => a.Member)      // nếu cần tên Member
                .Include(a => a.Consultant)  // nếu cần tên Consultant
                .Select(a => new AppointmentListItemDto
                {
                    AppointmentId = a.AppointmentId,
                    MemberId = a.MemberId!,
                    MemberName = a.Member!.FullName!,
                    ConsultantId = a.ConsultantId!.Value,
                    ConsultantName = a.Consultant!.FullName!,
                    StartTime = a.StartTime!.Value,
                    EndTime = a.EndTime!.Value,
                    Status = a.Status!,
                    Symptoms = a.Symptoms
                })
                .ToListAsync();

            return list;
        }

        public async Task<AppointmentDetailDto?> GetAppointmentByIdAsync(int appointmentId)
        {
            var a = await _context.Appointments
                .Include(x => x.Member)
                .Include(x => x.Consultant)
                .Include(x => x.Service)
                .FirstOrDefaultAsync(x => x.AppointmentId == appointmentId);

            if (a == null) return null;

            return new AppointmentDetailDto
            {
                AppointmentId = a.AppointmentId,
                MemberId = a.MemberId!,
                MemberName = a.Member!.FullName!,
                ConsultantId = a.ConsultantId!.Value,
                ConsultantName = a.Consultant!.FullName!,
                ServiceId = a.ServiceId!.Value,
                ServiceName = a.Service!.Name!,
                StartTime = a.StartTime!.Value,
                EndTime = a.EndTime!.Value,
                Status = a.Status!,
                MeetLink = a.MeetLink,
                Symptoms = a.Symptoms
            };
        }

        public async Task<IEnumerable<AppointmentListItemDto>> GetAppointmentsByUserIdAsync(int userId)
        {
            var list = await _context.Appointments
                .Where(a => a.MemberId == userId || a.ConsultantId == userId)
                .Include(a => a.Member)
                .Include(a => a.Consultant)
                .Select(a => new AppointmentListItemDto
                {
                    AppointmentId = a.AppointmentId,
                    MemberId = a.MemberId!,
                    MemberName = a.Member!.FullName!,
                    ConsultantId = a.ConsultantId!.Value,
                    ConsultantName = a.Consultant!.FullName!,
                    StartTime = a.StartTime!.Value,
                    EndTime = a.EndTime!.Value,
                    Status = a.Status!,
                    MeetLink = a.MeetLink,
                    Symptoms = a.Symptoms
                })
                .ToListAsync();
            return list;
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string newStatus)
        {
            var a = await _context.Appointments.FindAsync(appointmentId);
            if (a == null) return false;

            a.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAppointmentMeetLinkAsync(int appointmentId, string meetLink)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Member)
                .Include(a => a.Service)
                .Include(a => a.Consultant)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment == null) return false;

            appointment.MeetLink = meetLink;
            await _context.SaveChangesAsync();

            // Nếu có member, gửi notification
            if (appointment.MemberId != null)
            {
                var sendTime = DateTime.UtcNow.AddHours(7);
                var formattedSendTime = sendTime.ToString("HH:mm dd/MM/yyyy");
                var appointmentTime = appointment.StartTime?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa có lịch hẹn";
                var consultantName = appointment.Consultant?.FullName ?? "Chuyên gia";
                var serviceName = appointment.Service?.Name ?? "Dịch vụ";

                var content = 
                    $@"Dịch vụ: {serviceName}
                    Bác sĩ: {consultantName}
                    Ngày hẹn: {appointmentTime}
                    Link: {meetLink}
                    Thời gian gửi: {formattedSendTime}";

                var notification = new Notification
                {
                    UserId = appointment.MemberId,
                    Title = "Link tư vấn đã sẵn sàng",
                    Content = content,
                    SendTime = sendTime,
                    IsRead = false
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
            }

            return true;
        }

    }
}