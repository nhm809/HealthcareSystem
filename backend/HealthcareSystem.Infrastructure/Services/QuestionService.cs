using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using MimeKit.Tnef;

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
                .Where(q => q.Status != "Bị từ chối") 
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
                    Status = q.Status,
                    Age = q.Age,
                    Gender = q.Gender,
                    Heart = q.Heart,
                    AnsCount = q.AnsCount
                })
                .ToListAsync();
        }

        public async Task<bool> AddQuestionAsync(QuestionDTO questionDto)
        {
            if (questionDto == null || questionDto.MemberId == null)
                return false;

            var consultants = await _context.Users
                .Include(u => u.Specialties)
                .Where(u => u.Specialties.Any(s => s.SpecialtyId == questionDto.SpecialtyId)
                && u.RoleId == "CS" && u.IsAvailable )
                .ToListAsync();

            if (!consultants.Any()) return false;

            var luckyPerson = consultants[new Random().Next(consultants.Count)];

            var question = new Question
            {
                MemberId = questionDto.MemberId,
                SpecialtyId = questionDto.SpecialtyId,
                TitleQuestion = questionDto.TitleQuestion,
                Content = questionDto.Content,
                AttachmentPath = questionDto.AttachmentPath,
                SubmitDate = DateTime.UtcNow.AddHours(7),
                ConsultantId = luckyPerson.UserId,
                Age = questionDto.Age,
                Status = "Chua tra loi",
                Gender = questionDto.Gender,
                Heart = false,
                AnsCount = 0
            };

            await _context.Questions.AddAsync(question);

            var notifications = new[]
            {
                new Notification
                {
                    UserId = luckyPerson.UserId,
                    Content = $"Bạn có một câu hỏi mới từ {questionDto.MemberId}",
                    IsRead = false,
                    SendTime = DateTime.UtcNow.AddHours(7) 
                },
                new Notification
                {
                    UserId = questionDto.MemberId.Value,
                    Content = "Câu hỏi của bạn đã được gửi thành công và sẽ sớm được trả lời.",
                    IsRead = false,
                    SendTime = DateTime.UtcNow.AddHours(7)
                }
            };

            await _context.Notifications.AddRangeAsync(notifications);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> UpdateQuestionStatusAsync(int questionId, string status)
        {
            var question = await _context.Questions.FindAsync(questionId);
            if (question == null)
            {
                return false;
            }
            question.Status = status;
            _context.Questions.Update(question);

            var notification = new Notification
            {
                UserId = question.MemberId ?? 0,
                Content = "Câu hỏi của bạn: " + status,
                IsRead = false,
                SendTime = DateTime.UtcNow.AddHours(7)
            };

            await _context.Notifications.AddAsync(notification);

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

        public async Task<bool> UpdateHeart(QuestionDTO questionDto)
        {
            var question = await _context.Questions.FindAsync(questionDto.QuestionId);
            if (question == null)
            {
                return false;
            }
            if(question.Heart == true)
            {
                question.Heart = false;
            }
            else
            {
                question.Heart = true;
            }
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
                Status = question.Status,
                Age = question.Age,
                Gender = question.Gender,
                Heart = question.Heart,
                AnsCount = question.AnsCount
            };
        }

        public async Task<List<QuestionDTO>> GetQuestionsByMemberIdAsync(int memberId)
        {
            return await _context.Questions
                .Where(q => q.MemberId == memberId)
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
                    Status = q.Status,
                    Age = q.Age,
                    Gender = q.Gender,
                    Heart = q.Heart,
                    AnsCount = q.AnsCount
                })
                .ToListAsync();
        }

        public async Task<List<QuestionDTO>> GetQuestionsByConsultantIdAsync(int consultantId)
        {
            return await _context.Questions
                .Where(q => q.ConsultantId == consultantId)
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
                    Status = q.Status,
                    Age = q.Age,
                    Gender = q.Gender,
                    Heart = q.Heart,
                    AnsCount = q.AnsCount
                })
                .ToListAsync();
        }

        public async Task<int> CountAnswers(int questionId)
        {
            int ansCount = await _context.QuestionThreadItems
                .CountAsync(q => q.QuestionId == questionId && q.IsAnswered == true);
            return ansCount;
        }

    }
}