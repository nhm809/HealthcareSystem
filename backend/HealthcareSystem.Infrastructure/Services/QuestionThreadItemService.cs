
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

    public class QuestionThreadItemService : IQuestionThreadItemService
    {
        private readonly AppDbContext _context;
        public QuestionThreadItemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuestionThreadItemDTO>> GetSubQuestionAsync(int questionId)
        {
            return await _context.QuestionThreadItems
                .Where(q => q.QuestionId == questionId)
                .Select(q => new QuestionThreadItemDTO
                {
                    ThreadItemId = q.ThreadItemId,
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    AnswerText = q.AnswerText,
                    SentAt = q.SentAt,
                    AttachmentPath = q.AttachmentPath,
                    IsAnswered = q.IsAnswered
                })
                .ToListAsync();
        }

        public async Task<bool> AddSubQuestionAsync(QuestionThreadItemDTO dto)
        {
            if (dto == null || dto.QuestionText == null)
                return false;
            var subQuestion = new QuestionThreadItem
            {
                QuestionId = dto.QuestionId,
                QuestionText = dto.QuestionText,
                SentAt = DateTime.UtcNow,
                AttachmentPath = dto.AttachmentPath,
                IsAnswered = false 
            };
            _context.QuestionThreadItems.Add(subQuestion);

            var question = await _context.Questions
                .FirstOrDefaultAsync(q => q.QuestionId == dto.QuestionId);


            var memNoti = new Notification
            {
                UserId = question.MemberId,
                Content = $"Bạn đã đặt câu hỏi thành công {dto.QuestionText}",
                IsRead = false,
                SendTime = DateTime.UtcNow
            };

            var consNoti = new Notification
            {
                UserId = question.ConsultantId,
                Content = $"Bạn có một câu hỏi mới từ {dto.QuestionText}",
                IsRead = false,
                SendTime = DateTime.UtcNow
            };

            await _context.Notifications.AddRangeAsync(memNoti, consNoti);

            return await _context.SaveChangesAsync() > 0;
        }

    }
}