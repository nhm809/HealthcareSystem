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
public class ReproductiveReminderJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;

    public ReproductiveReminderJob(IConfiguration config, IServiceScopeFactory scopeFactory)
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

            var today = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));
            var nowTime = DateTime.UtcNow.AddHours(7).TimeOfDay;

            var cycles = await context.ReproductiveCycles
                .Where(c => c.StartDate.HasValue && c.CycleLength.HasValue)
                .GroupBy(c => c.MemberId)
                .Select(g => g
                    .OrderByDescending(c => c.StartDate)
                    .First())
                .ToListAsync(stoppingToken);

            foreach (var cycle in cycles)
            {
                var memberId = cycle.MemberId;

                var start = cycle.StartDate.Value;
                var length = cycle.CycleLength.Value;
                var end = start.AddDays(length);
                var ovulationDate = start.AddDays((length + 1) - 14);
                var fertileStart = ovulationDate.AddDays(-2);
                var fertileEnd = ovulationDate.AddDays(2);
                var nextStart = start.AddDays(length + 1);

                if (today == start && !await AlreadySentToday(context, memberId, "Bắt đầu chu kỳ mới"))
                {
                    string title = "Bắt đầu chu kỳ mới";
                    string content = "Hôm nay là ngày đầu chu kỳ mới. Hãy theo dõi sức khỏe nhé!";

                    // Gửi thông báo trong ứng dụng
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = title,
                        Content = content
                    });

                    // Gửi email nếu có địa chỉ
                    var user = await context.Users.FindAsync(cycle.MemberId);
                    if (user?.Email != null)
                    {
                        var email = new MimeMessage();
                        email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                        email.To.Add(MailboxAddress.Parse(user.Email));
                        email.Subject = "🔄 Chu kỳ mới đã bắt đầu";

                        email.Body = new TextPart("html")
                        {
                            Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #f4f8ff; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #cce3ff;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #1a73e8; text-align: center;'>Bắt đầu chu kỳ mới</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Hãy nghỉ ngơi, chăm sóc bản thân và theo dõi cơ thể trong những ngày đầu chu kỳ. Chúng tôi luôn đồng hành cùng bạn 💙
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/3846/3846801.png' alt='Cycle Start Icon'
                             style='width: 70px; opacity: 0.9;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #d0e7ff;' />

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


                if (today == ovulationDate && !await AlreadySentToday(context, memberId, "Ngày rụng trứng"))
                {
                    string title = "Ngày rụng trứng";
                    string content = "Hôm nay là ngày rụng trứng, khả năng mang thai cao nhất.";

                    // Gửi thông báo trong ứng dụng
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = title,
                        Content = content
                    });

                    // Gửi email nếu có
                    var user = await context.Users.FindAsync(cycle.MemberId);
                    if (user?.Email != null)
                    {
                        var email = new MimeMessage();
                        email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                        email.To.Add(MailboxAddress.Parse(user.Email));
                        email.Subject = "🔔 Hôm nay là ngày rụng trứng";

                        email.Body = new TextPart("html")
                        {
                            Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #fff9f9; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f5c6cb;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #c62828; text-align: center;'>Hôm nay là ngày rụng trứng</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Đây là thời điểm khả năng thụ thai cao nhất trong chu kỳ. Hãy ghi chú lại nếu bạn đang có kế hoạch mang thai 👶
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/3940/3940330.png' alt='Ovulation Icon'
                             style='width: 70px; opacity: 0.95;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #fdd;' />

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


                if (today == fertileStart && !await AlreadySentToday(context, memberId, "Bắt đầu thời kỳ dễ thụ thai"))
                {
                    string title = "Bắt đầu thời kỳ dễ thụ thai";
                    string content = "Bạn đã bước vào giai đoạn dễ thụ thai.";

                    // Gửi thông báo in-app
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = title,
                        Content = content
                    });

                    // Gửi email
                    var user = await context.Users.FindAsync(cycle.MemberId);
                    if (user?.Email != null)
                    {
                        var email = new MimeMessage();
                        email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                        email.To.Add(MailboxAddress.Parse(user.Email));
                        email.Subject = "🌸 Bắt đầu thời kỳ dễ thụ thai";

                        email.Body = new TextPart("html")
                        {
                            Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #f2f9f2; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #dcefdc;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #43a047; text-align: center;'>Bắt đầu thời kỳ dễ thụ thai</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Đây là thời điểm quan trọng nếu bạn đang lên kế hoạch mang thai hoặc theo dõi chu kỳ của mình 🌱
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/4205/4205273.png' alt='Fertility Window Icon'
                             style='width: 70px; opacity: 0.95;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #cdeacc;' />

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


                if (today == fertileEnd && !await AlreadySentToday(context, memberId, "Kết thúc thời kỳ dễ thụ thai"))
                {
                    string title = "Kết thúc thời kỳ dễ thụ thai";
                    string content = "Hôm nay là ngày cuối của giai đoạn dễ thụ thai.";

                    // Gửi thông báo in-app
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = title,
                        Content = content
                    });

                    // Gửi email
                    var user = await context.Users.FindAsync(cycle.MemberId);
                    if (user?.Email != null)
                    {
                        var email = new MimeMessage();
                        email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                        email.To.Add(MailboxAddress.Parse(user.Email));
                        email.Subject = "Thông báo: Kết thúc thời kỳ dễ thụ thai";

                        email.Body = new TextPart("html")
                        {
                            Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #fff8f8; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #fdd;'>

                    <!-- Logo -->
                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <!-- Nội dung -->
                    <h2 style='color: #d32f2f; text-align: center;'>Kết thúc thời kỳ dễ thụ thai</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Hãy tiếp tục theo dõi chu kỳ và chăm sóc sức khỏe sinh sản của bạn một cách chủ động 💖
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/4024/4024511.png' alt='Fertility Icon'
                             style='width: 70px; opacity: 0.9;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #fdd;' />

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


                if (cycle.PillTime.HasValue && !await AlreadySentToday(context, memberId, "Uống thuốc tránh thai"))
                {
                    var now = DateTime.UtcNow.AddHours(7);
                    var currentTime = TimeOnly.FromDateTime(now);
                    var pillTime = cycle.PillTime.Value;

                    var diffMinutes = Math.Abs((pillTime.ToTimeSpan() - currentTime.ToTimeSpan()).TotalMinutes);
                    if (diffMinutes <= 15)
                    {
                        string title = "Uống thuốc tránh thai";
                        string content = $"Đã đến giờ uống thuốc tránh thai: {pillTime}.";

                        // Gửi email
                        var user = await context.Users.FindAsync(cycle.MemberId);
                        if (user?.Email != null)
                        {
                            var email = new MimeMessage();
                            email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                            email.To.Add(MailboxAddress.Parse(user.Email));
                            email.Subject = "⏰ Nhắc bạn: Đã đến giờ uống thuốc tránh thai";

                            email.Body = new TextPart("html")
                            {
                                Text = $@"
                    <div style='font-family: Arial, sans-serif; background-color: #f9f9fc; padding: 30px 0;'>
                        <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;'>

                            <div style='text-align: center; margin-bottom: 24px;'>
                                <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                                     alt='Healthcare System Logo'
                                     style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                            </div>

                            <h2 style='color: #1a73e8; text-align: center;'>Đã đến giờ uống thuốc tránh thai</h2>

                            <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                                Hệ thống <strong>Healthcare System</strong> nhắc bạn rằng hôm nay đến giờ uống thuốc vào lúc 
                                <strong style='color: #1a73e8; font-size: 18px;'>{pillTime}</strong>.
                            </p>

                            <p style='font-size: 15px; color: #555; text-align: center; margin-top: 20px;'>
                                Việc uống thuốc đúng giờ giúp bạn duy trì hiệu quả tránh thai và bảo vệ sức khỏe sinh sản 💊
                            </p>

                            <div style='text-align: center; margin-top: 30px;'>
                                <img src='https://cdn-icons-png.flaticon.com/512/2605/2605580.png' alt='Pill Icon'
                                     style='width: 60px; opacity: 0.85;' />
                            </div>

                            <hr style='margin: 40px 0; border-top: 1px solid #e0e0e0;' />

                            <p style='font-size: 12px; color: #999; text-align: center;'>
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

                        // Tạo thông báo in-app
                        await notiService.CreateNotiAsync(new CreateNotiDTO
                        {
                            UserId = cycle.MemberId,
                            Title = title,
                            Content = content
                        });
                    }
                }

                if (today == nextStart && !await AlreadySentToday(context, memberId, "Chu kỳ mới dự đoán bắt đầu"))
                {
                    string title = "Chu kỳ mới dự đoán bắt đầu";
                    string content = "Hôm nay là ngày dự đoán chu kỳ tiếp theo bắt đầu.";

                    // Gửi thông báo trong ứng dụng
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = title,
                        Content = content
                    });

                    // Gửi email nếu có
                    var user = await context.Users.FindAsync(cycle.MemberId);
                    if (user?.Email != null)
                    {
                        var email = new MimeMessage();
                        email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
                        email.To.Add(MailboxAddress.Parse(user.Email));
                        email.Subject = "🔄 Dự đoán bắt đầu chu kỳ kinh nguyệt mới";

                        email.Body = new TextPart("html")
                        {
                            Text = $@"
            <div style='font-family: Arial, sans-serif; background-color: #f9fcff; padding: 30px 0;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #d0e7ff;'>

                    <div style='text-align: center; margin-bottom: 24px;'>
                        <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                             alt='Healthcare System Logo'
                             style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                    </div>

                    <h2 style='color: #1a73e8; text-align: center;'>Chu kỳ mới dự đoán bắt đầu</h2>

                    <p style='font-size: 16px; color: #333; text-align: center; line-height: 1.6;'>
                        {content}
                    </p>

                    <p style='font-size: 14px; color: #555; text-align: center; margin-top: 20px;'>
                        Đây là thời điểm bạn có thể chuẩn bị theo dõi chu kỳ tiếp theo và chăm sóc cơ thể kỹ càng hơn 💙
                    </p>

                    <div style='text-align: center; margin-top: 30px;'>
                        <img src='https://cdn-icons-png.flaticon.com/512/6782/6782195.png' alt='Predicted Cycle Icon'
                             style='width: 70px; opacity: 0.95;' />
                    </div>

                    <hr style='margin: 40px 0; border-top: 1px solid #d0e7ff;' />

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

            }

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }

    }
    
    private static async Task<bool> AlreadySentToday(AppDbContext context, int userId, string title)
    {
        var today = DateTime.UtcNow.AddHours(7).Date;
        return await context.Notifications.AnyAsync(n =>
            n.UserId == userId &&
            n.Title == title &&
            n.SendTime.Value.Date == today
        );
    }
}
