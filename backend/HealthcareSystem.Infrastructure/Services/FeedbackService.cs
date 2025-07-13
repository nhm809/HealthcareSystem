using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;


namespace Infrastructure.Services
{
    
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _context;
        
        public FeedbackService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> SubmitFeedbackAsync(FeedbackDTO dto)
        {
            var feedback = new Feedback
            {
                AppointmentId = dto.AppointmentId,
                RecordId = dto.RecordId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                FeedbackDate = DateTime.UtcNow.AddHours(7)
            };

            _context.Feedbacks.Add(feedback);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<FeedbackDTO>> GetFeedbackByAppointmentIdAsync(int appointmentId)
        {
            var feedbackList = await _context.Feedbacks
                .Where(f => f.AppointmentId == appointmentId)
                .Select(f => new FeedbackDTO
                {
                    AppointmentId = f.AppointmentId,
                    Rating = f.Rating,
                    Comment = f.Comment,
                    FeedbackDate = f.FeedbackDate
                })
                .ToListAsync();

            return feedbackList;
        }

        public async Task<IEnumerable<FeedbackDTO>> GetFeedbackByRecordIdAsync(int recordId)
        {
            var feedbackList = await _context.Feedbacks
                .Where(f => f.RecordId == recordId)
                .Select(f => new FeedbackDTO
                {
                    RecordId = f.RecordId,
                    Rating = f.Rating,
                    Comment = f.Comment,
                    FeedbackDate = f.FeedbackDate
                })
                .ToListAsync();

            return feedbackList;
        }
        public async Task<IEnumerable<FeedbackDTO>> GetAllFeedbackAsync()
        {
            var feedbackList = await _context.Feedbacks
                .Select(f => new FeedbackDTO
                {
                    AppointmentId = f.AppointmentId,
                    RecordId = f.RecordId,
                    Rating = f.Rating,
                    Comment = f.Comment,
                    FeedbackDate = f.FeedbackDate
                })
                .ToListAsync();
            return feedbackList;
        }
    }
}