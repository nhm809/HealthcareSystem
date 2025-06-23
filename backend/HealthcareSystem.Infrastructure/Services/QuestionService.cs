using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Infrastructure.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly AppDbContext _context;

        public QuestionService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<QuestionDTO>> GetAllQuestionsAsync()
        {
            return await _context.Questions
                .Select(q => new QuestionDTO
                {
                    QuestionId = q.QuestionId,
                    MemberId = q.MemberId,
                    SpecialtyId = q.SpecialtyId,
                    TitleQuestion = q.TitleQuestion,
                    Content = q.Content,
                    AttachmentPath = q.AttachmentPath,
                    SubmitDate = q.SubmitDate,
                    ConsultantId = q.ConsultantId,
                    IsAnswered = q.IsAnswered,
                    Age = q.Age,
                    Gender = q.Gender,
                    HeartCount = q.HeartCount,
                    MessCount = q.MessCount
                })
                .ToListAsync();
        }

        public async Task<bool> AddQuestionAsync(QuestionDTO questionDto)
        {

            //var specialtyId = await _context.Specialties
            //    .Where(s => s.Name == questionDto.Specialty)
            //    .Select(s => s.SpecialtyId)
            //    .FirstOrDefaultAsync();

            var consultants = await _context.Users
                .Include(u => u.Specialties)
                .Where(u => u.Specialties.Any(s => s.SpecialtyId == questionDto.SpecialtyId))
                .ToListAsync();

            var consultantIds = consultants.Select(c => c.UserId).ToList();

            var random = new Random();

            if (!consultants.Any())
                return false;

            var luckyPerson = consultants[random.Next(consultants.Count)];

            var countMess = await _context.Messages
                .Where(m => m.QuestionId == questionDto.QuestionId)
                .CountAsync();

            var question = new Question
            {
                MemberId = questionDto.MemberId,
                SpecialtyId = questionDto.SpecialtyId,
                TitleQuestion = questionDto.TitleQuestion,
                Content = questionDto.Content,
                AttachmentPath = questionDto.AttachmentPath,
                SubmitDate = DateTime.UtcNow,
                ConsultantId = luckyPerson.UserId,
                IsAnswered = false,
                Age = questionDto.Age,
                Gender = questionDto.Gender,
                HeartCount = 0,
                MessCount = 0
            };
            _context.Questions.Add(question);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuestionStatusAsync(int questionId)
        {
            var question = await _context.Questions.FindAsync(questionId);
            if (question == null)
            {
                return false;
            }
            question.IsAnswered = true;
            _context.Questions.Update(question);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteQuestionAsync(int questionId)
        {
            var question = await _context.Questions.FindAsync(questionId);
            if (question == null)
            {
                return false;
            }
            _context.Questions.Remove(question);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> GiveAHeart(QuestionDTO questionDto)
        {
            var question = await _context.Questions.FindAsync(questionDto.QuestionId);
            if (question == null)
            {
                return false;
            }
            question.HeartCount = (question.HeartCount ?? 0) + 1;
            _context.Questions.Update(question);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<QuestionDTO> GetQuestionById(int questionId)
        {
            var question = await _context.Questions.FindAsync(questionId);
            if (question == null)
            {
                return null;
            }
            return new QuestionDTO
            {
                QuestionId = questionId,
                MemberId = question.MemberId,
                SpecialtyId = question.SpecialtyId,
                TitleQuestion = question.TitleQuestion,
                Content = question.Content,
                AttachmentPath = question.AttachmentPath,
                SubmitDate = question.SubmitDate,
                ConsultantId = question.ConsultantId,
                IsAnswered = question.IsAnswered,
                Age = question.Age,
                Gender = question.Gender,
                HeartCount = question.HeartCount,
                MessCount = question.MessCount
            };
        }
    }
}