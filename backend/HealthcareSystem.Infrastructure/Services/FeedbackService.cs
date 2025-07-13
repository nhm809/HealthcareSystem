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
        public async Task<IEnumerable<ServiceSummaryDTO>> GetServiceSummariesAsync()
        {
            var serviceSummaries = await _context.Services
                .Select(s => new
                {
                    Service = s,
                    Feedbacks = _context.Feedbacks
                        .Include(f => f.Appointment) // Đảm bảo tải Appointment để truy cập ServiceId
                        .Include(f => f.Record)     // Đảm bảo tải Record để truy cập ServiceId
                        .Where(f => (f.Appointment != null && f.Appointment.ServiceId == s.ServiceId) || // Đã sửa s.Id thành s.ServiceId
                                    (f.Record != null && f.Record.ServiceId == s.ServiceId)) // Đã sửa s.Id thành s.ServiceId
                        .ToList()
                })
                .Where(x => x.Feedbacks.Any())
                .Select(x => new ServiceSummaryDTO
                {
                    ServiceId = x.Service.ServiceId, // Đã sửa x.Service.Id thành x.Service.ServiceId
                    ServiceName = x.Service.Name,
                    FeedbackCount = x.Feedbacks.Count(),
                    AverageRating = x.Feedbacks.Any() ? x.Feedbacks.Average(f => f.Rating ?? 0) : 0
                })
                .ToListAsync();

            return serviceSummaries;
        }

        public async Task<ServiceFeedbackDetailDTO> GetServiceFeedbackDetailsAsync(int serviceId, int pageNumber, int pageSize)
        {
            // Load service để lấy ServiceName, nếu không tìm thấy trả về null
            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceId == serviceId);
            if (service == null)
            {
                return null;
            }

            var query = _context.Feedbacks
                .Include(f => f.Appointment)
                    .ThenInclude(a => a.Member)
                .Include(f => f.Record)
                    .ThenInclude(r => r.Member)
                .Where(f => (f.Appointment != null && f.Appointment.ServiceId == serviceId) ||
                            (f.Record != null && f.Record.ServiceId == serviceId))
                .OrderByDescending(f => f.FeedbackDate);

            var totalFeedbacks = await query.CountAsync();

            var feedbackDetails = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new IndividualFeedbackDTO
                {
                    FeedbackId = f.FeedbackId,
                    // Sử dụng toán tử điều kiện (ternary) để tránh lỗi null-propagating trong expression tree
                    UserName = (f.Appointment != null && f.Appointment.Member != null) ? f.Appointment.Member.FullName :
                               (f.Record != null && f.Record.Member != null) ? f.Record.Member.FullName :
                               (f.Record != null ? f.Record.FullNameOfMember : "N/A"),
                    Rating = f.Rating ?? 0,
                    Comment = f.Comment,
                    CreatedAt = f.FeedbackDate ?? DateTime.MinValue
                })
                .ToListAsync();

            return new ServiceFeedbackDetailDTO
            {
                ServiceId = service.ServiceId,
                ServiceName = service.Name,
                Feedbacks = feedbackDetails
            };
        }
    }
}