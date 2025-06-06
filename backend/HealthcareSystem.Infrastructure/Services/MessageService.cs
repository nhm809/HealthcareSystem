
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Infrastructure.Services
{
    
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _context;
        public MessageService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<MessageDTO>> GetMessagesHistoryAsync(int questionId)
        {
            return await _context.Messages
                .Where(m => m.QuestionId == questionId)
                .Select(m => new MessageDTO
                {
                    QuestionId = m.QuestionId,
                    Content = m.Content,
                    SenderId = m.SenderId,
                    SentAt = m.SentAt
                })
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
        public async Task<bool> AddMessageAsync(MessageDTO messageDto)
        {
            var message = new Message
            {
                QuestionId = messageDto.QuestionId,
                Content = messageDto.Content,
                SenderId = messageDto.SenderId,
                SentAt = messageDto.SentAt ?? DateTime.UtcNow
            };
            _context.Messages.Add(message);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}