
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
                QuestionId = dto.ThreadItemId, // Assuming ThreadItemId is the QuestionId here
                QuestionText = dto.QuestionText,
                AnswerText = dto.AnswerText,
                SentAt = dto.SentAt,
                AttachmentPath = dto.AttachmentPath,
                IsAnswered = dto.IsAnswered
            };
            _context.QuestionThreadItems.Add(subQuestion);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}