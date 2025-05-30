using Application.DTOs;
using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using HealthcareSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthcareSystem.Application.Services
{
    public class HomeService : IHomeService
    {
        private readonly AppDbContext _context;

        public HomeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<HomeGuestDTO> GetGuestHomeData()
        {
            var services = _context.Services
                .Select(s => new ServiceHighlightDTO
                {
                    ServiceId = s.ServiceId,
                    Name = s.Name,
                    Description = s.Description
                })
                .Take(5) // lấy top 5 dịch vụ (tuỳ bạn)
                .ToList();

            var blogs = _context.Blogs
                .OrderByDescending(b => b.BlogImages)//chỗ này sẽ lấy các bài blog mới nhất hoặc b.Consultant lấy tên Bác sĩ đăng Blog
                .Select(b => new GetBlogDTO
                {
                    BlogID = b.BlogId,
                    Title = b.Title,
                    Description = b.Content.Substring(0, Math.Min(100, b.Content.Length)),
                    Topic = b.Topic,
                    PublishDate = b.PublishDate,
                    ConsultantName = b.Consultant.FullName, // nếu có quan hệ Blog ↔ User
                    ThumbnailImagePath = b.ThumbnailImagePath
                })
                .Take(3)
                .ToList();

            return new HomeGuestDTO
            {
                HighlightedServices = services,
                HighlightedBlogs = blogs
            };
        }
    }
}
