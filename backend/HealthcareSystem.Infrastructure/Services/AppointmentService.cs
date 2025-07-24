using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AppointmentService(IConfiguration config, AppDbContext context)
        {
            _context = context;
            _config = config;
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

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(member.Email));
            email.Subject = "Xác nhận lịch hẹn thành công";

            email.Body = new TextPart("html")
            {
                Text = $@"
        <div style='font-family: Arial, sans-serif; background-color: #f2f6f9; padding: 30px 0;'>
            <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;'>

                <!-- Logo -->
                <div style='text-align: center; margin-bottom: 24px;'>
                    <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                         alt='Healthcare System Logo'
                         style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                </div>

                <!-- Nội dung chính -->
                <h2 style='color: #1a73e8; text-align: center; margin-bottom: 20px;'>Đặt lịch thành công</h2>

                <p style='font-size: 15px; color: #333; line-height: 1.6; text-align: center;'>
                    Xin chào <strong>{member.FullName}</strong>,
                    <br />
                    Bạn đã <strong>đặt lịch hẹn thành công</strong> với chuyên gia <strong>{consultantName}</strong> vào lúc <strong>{formattedTime}</strong>.
                </p>

                <div style='text-align: center; margin: 30px 0;'>
                    <p style='font-size: 14px; color: #555;'>Vui lòng kiểm tra ứng dụng hoặc trang cá nhân để xem chi tiết lịch hẹn.</p>
                </div>

                <p style='font-size: 14px; color: #555; text-align: center;'>
                    Nếu bạn cần thay đổi hoặc hủy lịch hẹn, vui lòng thực hiện trước giờ hẹn tối thiểu 2 tiếng.
                </p>

                <hr style='margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;' />

                <p style='font-size: 12px; color: #999; text-align: center;'>
                    Email được gửi tự động từ hệ thống <strong>Healthcare System</strong>. Vui lòng không phản hồi lại email này.
                </p>
            </div>
        </div>
    "
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

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
            var appointment = await _context.Appointments
                .Include(a => a.Member)
                .Include(a => a.Service)
                .Include(a => a.Consultant)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment == null) return false;

            var a = await _context.Appointments.FindAsync(appointmentId);
            if (a == null) return false;

            a.Status = newStatus;
            await _context.SaveChangesAsync();

            if (newStatus == "Da hoan thanh")
            {
                var sendTime = DateTime.UtcNow.AddHours(7);
                var formattedSendTime = sendTime.ToString("HH:mm dd/MM/yyyy");
                var appointmentTime = appointment.StartTime?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa có lịch hẹn";
                var consultantName = appointment.Consultant?.FullName ?? "Chuyên gia";

                var notification = new Notification
                {
                    UserId = appointment.MemberId,
                    Title = "Cuộc hẹn đã hoàn thành",
                    Content = $"Lịch hẹn của bạn với {consultantName} vào lúc {appointmentTime} đã hoàn thành. Bạn có thể đánh giá trong vòng 7 ngày tới",
                    SendTime = sendTime,
                    IsRead = false
                };
                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
            }
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
                var appointmentTime = appointment.StartTime?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa có lịch hẹn";
                var consultantName = appointment.Consultant?.FullName ?? "Chuyên gia";
                var serviceName = appointment.Service?.Name ?? "Dịch vụ";

                var content = 
                    $@"Dịch vụ: {serviceName}
                    Bác sĩ: {consultantName}
                    Ngày hẹn: {appointmentTime}
                    Link: {meetLink}";

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