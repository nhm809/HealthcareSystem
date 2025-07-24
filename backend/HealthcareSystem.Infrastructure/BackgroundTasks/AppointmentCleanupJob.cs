using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using System;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;
using Domain.Entities;
using System.Security.Cryptography;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace Infrastructure.BackgroundTasks;
public class AppointmentCleanupJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;

    public AppointmentCleanupJob(IConfiguration config, IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var notiService = scope.ServiceProvider.GetRequiredService<INotiService>();

            var now = DateTime.UtcNow.AddHours(7);
            var limit = now.AddHours(1);

            var pendingAppointments = await context.Appointments
                .Where(a => a.Status == "Dang thanh toan" && a.StartTime <= limit)
                .ToListAsync(stoppingToken);

            foreach (var appt in pendingAppointments)
            {
                appt.Status = "Da huy";

                string title = "Cuộc hẹn bị hủy";
                string content = $"Cuộc hẹn với {appt.Consultant.FullName} vào lúc {appt.StartTime:HH:mm dd/MM/yyyy} đã bị hủy do chưa thanh toán đúng hạn.";

                // Gửi thông báo in-app
                await notiService.CreateNotiAsync(new CreateNotiDTO
                {
                    UserId = appt.MemberId,
                    Title = title,
                    Content = content,
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false,
                });

                // Gửi email nếu có
                var member = await context.Users.FindAsync(appt.MemberId);
                if (member?.Email != null)
                {
                    var email = new MimeMessage();
                    email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                    email.To.Add(MailboxAddress.Parse(member.Email));
                    email.Subject = "❌ Cuộc hẹn đã bị hủy do chưa thanh toán";

                    email.Body = new TextPart("html")
                    {
                        Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #fff3f3; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f7c6c6;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #d32f2f; text-align: center;'>Cuộc hẹn đã bị hủy</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Nếu bạn vẫn muốn đặt lại lịch, vui lòng truy cập ứng dụng và tạo cuộc hẹn mới.
                        <br/>
                        Cảm ơn bạn đã sử dụng <strong>Healthcare System</strong>.
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/6792/6792621.png' alt='Cancelled Icon'
                             style='width: 70px; opacity: 0.95;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #f0baba;' />

                    <p style='font-size: 12px; color: #aaa; text-align: center;'>
                        Email được gửi tự động từ hệ thống <strong>Healthcare System</strong>. Vui lòng không phản hồi lại email này.
                    </p>
                </div>
            </div>"
                    };

                    using var smtp = new SmtpClient();
                    await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }
            }


            if (pendingAppointments.Count > 0)
            {
                await context.SaveChangesAsync(stoppingToken);
            }

            // Nhắc người dùng thanh toán nếu sắp đến cuộc hẹn
            var reminderStart = now.AddHours(1);
            var reminderEnd = now.AddHours(2);

            var remindAppointments = await context.Appointments
                .Where(a => a.Status == "Dang thanh toan" &&
                            a.StartTime >= reminderStart &&
                            a.StartTime <= reminderEnd)
                .ToListAsync(stoppingToken);

            foreach (var appt in remindAppointments)
            {
                string formattedTime = appt.StartTime?.ToString("HH:mm dd/MM/yyyy") ?? "";

                // Tránh gửi lại nếu hôm nay đã nhắc
                bool alreadyReminded = await context.Notifications.AnyAsync(n =>
                    n.UserId == appt.MemberId &&
                    n.Title == "Nhắc thanh toán cuộc hẹn" &&
                    n.SendTime.HasValue &&
                    n.SendTime.Value.Date == now.Date &&
                    n.Content.Contains(formattedTime), stoppingToken);

                if (alreadyReminded)
                    continue;

                string title = "Nhắc thanh toán cuộc hẹn";
                string content = $"Bạn có cuộc hẹn với {appt.Consultant.FullName} vào {formattedTime}. Vui lòng hoàn thành thanh toán trước giờ tư vấn 1 giờ để không bị hủy.";

                // Gửi notification
                await notiService.CreateNotiAsync(new CreateNotiDTO
                {
                    UserId = appt.MemberId,
                    Title = title,
                    Content = content,
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false,
                });

                // Gửi email nếu có địa chỉ
                var user = await context.Users.FindAsync(appt.MemberId);
                if (user?.Email != null)
                {
                    var email = new MimeMessage();
                    email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                    email.To.Add(MailboxAddress.Parse(user.Email));
                    email.Subject = "💳 Nhắc thanh toán trước cuộc hẹn";

                    email.Body = new TextPart("html")
                    {
                        Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #fffdf5; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #ffe0b2;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #f57c00; text-align: center;'>Nhắc thanh toán trước cuộc hẹn</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Hệ thống sẽ tự động hủy cuộc hẹn nếu chưa được thanh toán đúng giờ. Hãy đảm bảo thanh toán sớm để giữ lịch hẹn với bác sĩ nhé!
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/3502/3502458.png' alt='Payment Reminder Icon'
                             style='width: 70px; opacity: 0.95;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #ffd180;' />

                    <p style='font-size: 12px; color: #aaa; text-align: center;'>
                        Email được gửi tự động từ hệ thống <strong>Healthcare System</strong>. Vui lòng không phản hồi lại email này.
                    </p>
                </div>
            </div>"
                    };

                    using var smtp = new SmtpClient();
                    await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }
            }

            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}
