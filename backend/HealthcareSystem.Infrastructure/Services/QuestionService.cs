
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
                    Specialty = q.Specialty,
                    TitleQuestion = q.TitleQuestion,
                    Content = q.Content,
                    AttachmentPath = q.AttachmentPath,
                    SubmitDate = q.SubmitDate,
                    ConsultantId = q.ConsultantId,
                    IsAnswered = q.IsAnswered
                })
                .ToListAsync();
        }

        public async Task<bool> AddQuestionAsync(QuestionDTO questionDto)
        {

            var specialtyId = await _context.Specialties
                .Where(s => s.Name == questionDto.Specialty)
                .Select(s => s.SpecialtyId)
                .FirstOrDefaultAsync();

            var consultants = await _context.Users
                .Include(u => u.Specialties)
                .Where(u => u.Specialties.Any(s => s.SpecialtyId == specialtyId))
                .ToListAsync();

            var consultantIds = consultants.Select(c => c.UserId).ToList();

            var random = new Random();

            if (!consultants.Any())
                return false; 

            var luckyPerson = consultants[random.Next(consultants.Count)];


            var question = new Question
            {
                MemberId = questionDto.MemberId,
                Specialty = questionDto.Specialty,
                TitleQuestion = questionDto.TitleQuestion,
                Content = questionDto.Content,
                AttachmentPath = questionDto.AttachmentPath,
                SubmitDate = DateTime.UtcNow,
                ConsultantId = luckyPerson.UserId,
                IsAnswered = false
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

    }
}