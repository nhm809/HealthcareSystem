using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;
using System;

namespace Infrastructure.Services
{
    public class NotiService : INotiService
    {
        private readonly AppDbContext _context;
        public NotiService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<List<NotiDTO>> GetAllNotiAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .Select(n => new NotiDTO
                {
                    NotificationId = n.NotificationId,
                    Title = n.Title ?? string.Empty,
                    Content = n.Content ?? string.Empty,
                    SendTime = n.SendTime,
                    IsRead = n.IsRead
                })
                .ToListAsync();
        }

        public async Task<bool> CreateNotiAsync(CreateNotiDTO createNotiDTO)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = createNotiDTO.UserId,
                    Title = createNotiDTO.Title,
                    Content = createNotiDTO.Content,
                    SendTime = DateTime.UtcNow.AddHours(7),
                    IsRead = false
                };
                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<int> MarkAsReadAsync(int notiId)
        {
            var notification = await _context.Notifications.FindAsync(notiId);
            if (notification == null)
            {
                throw new Exception("Notification not found.");
            }
            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return notiId;
        }
    }
}
