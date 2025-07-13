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

public class ReproductiveReminderJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ReproductiveReminderJob(IServiceScopeFactory scopeFactory)
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
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = "Bắt đầu chu kỳ mới",
                        Content = "Hôm nay là ngày đầu chu kỳ mới. Hãy theo dõi sức khỏe nhé!"
                    });
                }

                if (today == ovulationDate && !await AlreadySentToday(context, memberId, "Ngày rụng trứng"))
                {
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = "Ngày rụng trứng",
                        Content = "Hôm nay là ngày rụng trứng, khả năng mang thai cao nhất."
                    });
                }

                if (today == fertileStart && !await AlreadySentToday(context, memberId, "Bắt đầu thời kỳ dễ thụ thai"))
                {
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = "Bắt đầu thời kỳ dễ thụ thai",
                        Content = "Bạn đã bước vào giai đoạn dễ thụ thai."
                    });
                }

                if (today == fertileEnd && !await AlreadySentToday(context, memberId, "Kết thúc thời kỳ dễ thụ thai"))
                {
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = "Kết thúc thời kỳ dễ thụ thai",
                        Content = "Hôm nay là ngày cuối của giai đoạn dễ thụ thai."
                    });
                }

                if (cycle.PillTime.HasValue && !await AlreadySentToday(context, memberId, "Uống thuốc tránh thai"))
                {
                    var now = DateTime.UtcNow.AddHours(7);
                    var currentTime = TimeOnly.FromDateTime(now);
                    var pillTime = cycle.PillTime.Value;

                    var diffMinutes = Math.Abs((pillTime.ToTimeSpan() - currentTime.ToTimeSpan()).TotalMinutes);
                    if (diffMinutes <= 15)
                    {
                        await notiService.CreateNotiAsync(new CreateNotiDTO
                        {
                            UserId = cycle.MemberId,
                            Title = "Uống thuốc tránh thai",
                            Content = $"Đã đến giờ uống thuốc tránh thai: {pillTime}."
                        });
                    }
                }

                if (today == nextStart && !await AlreadySentToday(context, memberId, "Chu kỳ mới dự đoán bắt đầu"))
                {
                    await notiService.CreateNotiAsync(new CreateNotiDTO
                    {
                        UserId = cycle.MemberId,
                        Title = "Chu kỳ mới dự đoán bắt đầu",
                        Content = "Hôm nay là ngày dự đoán chu kỳ tiếp theo bắt đầu."
                    });
                }
            }

            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
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
