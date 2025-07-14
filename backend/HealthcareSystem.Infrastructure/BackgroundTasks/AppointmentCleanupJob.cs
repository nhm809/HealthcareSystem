// AppointmentCleanupJob.cs
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;
using Application.DTOs;

public class AppointmentCleanupJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public AppointmentCleanupJob(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
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

                await notiService.CreateNotiAsync(new CreateNotiDTO
                {
                    UserId = appt.MemberId,
                    Title = "Cuộc hẹn bị hủy",
                    Content = $"Cuộc hẹn với {appt.Consultant.FullName} vào lúc {appt.StartTime:HH:mm dd/MM/yyyy} đã bị hủy do chưa thanh toán đúng hạn.",
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false,
                });
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
                // Tránh gửi lại nếu hôm nay đã gửi
                bool alreadyReminded = await context.Notifications.AnyAsync(n =>
                    n.UserId == appt.MemberId &&
                    n.Title == "Nhắc thanh toán cuộc hẹn" &&
                    n.SendTime.HasValue &&
                    n.SendTime.Value.Date == now.Date &&
                    n.Content.Contains(appt.StartTime.Value.ToString("HH:mm dd/MM/yyyy")), stoppingToken);

                if (alreadyReminded)
                    continue;

                await notiService.CreateNotiAsync(new CreateNotiDTO
                {
                    UserId = appt.MemberId,
                    Title = "Nhắc thanh toán cuộc hẹn",
                    Content = $"Bạn có cuộc hẹn với {appt.Consultant.FullName} vào {appt.StartTime:HH:mm dd/MM/yyyy}. Vui lòng hoàn thành thanh toán trước giờ tư vấn 1 giờ để không bị hủy.",
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false,
                });
            }

            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}
