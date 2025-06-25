using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class BlogService : IBlogService
    {
        private readonly AppDbContext _context;

        public BlogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GetBlogDTO>> GetAllBlogsAsync()
        {
            return await _context.Blogs
                .Include(b => b.BlogImages)
                .Include(b => b.BlogViews)
                .Include(b => b.Consultant)
                .Where(b => b.PublishDate != null && b.Status)
                .OrderByDescending(b => b.PublishDate)
                .Select(b => new GetBlogDTO
                {
                    BlogID = b.BlogId,
                    Title = b.Title ?? string.Empty,
                    Description = b.Description ?? string.Empty,
                    Topic = b.Topic ?? string.Empty,
                    PublishDate = b.PublishDate.HasValue ?
                        b.PublishDate.Value.ToDateTime(TimeOnly.MinValue) :
                        DateTime.MinValue,
                    ConsultantName = b.Consultant != null ?
                        b.Consultant.FullName ?? "Unknown" :
                        "Unknown",
                    ThumbnailImagePath = b.BlogImages.Any() ?
                        b.BlogImages.OrderBy(i => i.OrderIndex ?? 0).First().ImagePath ?? string.Empty :
                        string.Empty
                })
                .ToListAsync();
        }

        public async Task<BlogContentDTO?> GetBlogContentByIdAsync(int blogId)
        {
            var blog = await _context.Blogs
                .Include(b => b.BlogImages)
                .Include(b => b.BlogViews)
                .Include(b => b.Consultant)
                .FirstOrDefaultAsync(b => b.BlogId == blogId && b.Status);

            if (blog == null) return null;

            return new BlogContentDTO
            {
                BlogID = blog.BlogId,
                Title = blog.Title ?? string.Empty,
                Description = blog.Description ?? string.Empty,
                Content = blog.Content ?? string.Empty,
                Topic = blog.Topic ?? string.Empty,
                PublishDate = blog.PublishDate.HasValue ?
                    blog.PublishDate.Value.ToDateTime(TimeOnly.MinValue) :
                    DateTime.MinValue,
                ConsultantName = blog.Consultant != null ?
                    blog.Consultant.FullName ?? "Unknown" :
                    "Unknown",
                Images = blog.BlogImages
                    .OrderBy(i => i.OrderIndex ?? 0)
                    .Select(i => new BlogImageDTO
                    {
                        ImageID = i.ImageId,
                        ImagePath = i.ImagePath ?? string.Empty,
                        ImageCaption = i.ImageCaption ?? string.Empty,
                        UploadDate = i.UploadDate ?? DateTime.MinValue,
                        OrderIndex = i.OrderIndex ?? 0
                    }).ToList()
            };
        }

        public async Task AddBlogViewAsync(int blogId, int memberId)
        {
            var existingView = await _context.BlogViews
                .FirstOrDefaultAsync(bv => bv.BlogId == blogId && bv.MemberId == memberId);

            if (existingView == null)
            {
                var blogView = new BlogView
                {
                    BlogId = blogId,
                    //MemberId = memberId,
                    ViewDate = DateTime.Now
                };

                _context.BlogViews.Add(blogView);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<GetBlogDTO>> GetPopularBlogsAsync(int count = 5)
        {
            return await _context.Blogs
                .Include(b => b.BlogImages)
                .Include(b => b.BlogViews)
                .Include(b => b.Consultant)
                .Where(b => b.PublishDate != null && b.Status)
                .OrderByDescending(b => b.BlogViews.Count)
                .ThenByDescending(b => b.PublishDate)
                .Take(count)
                .Select(b => new GetBlogDTO
                {
                    BlogID = b.BlogId,
                    Title = b.Title ?? string.Empty,
                    Description = b.Description ?? string.Empty,
                    Topic = b.Topic ?? string.Empty,
                    PublishDate = b.PublishDate.HasValue ?
                        b.PublishDate.Value.ToDateTime(TimeOnly.MinValue) :
                        DateTime.MinValue,
                    ConsultantName = b.Consultant != null ?
                        b.Consultant.FullName ?? "Unknown" :
                        "Unknown",
                    ThumbnailImagePath = b.BlogImages.Any() ?
                        b.BlogImages.OrderBy(i => i.OrderIndex ?? 0).First().ImagePath ?? string.Empty :
                        string.Empty
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<GetBlogDTO>> GetBlogsByTopicAsync(string topic)
        {
            if (string.IsNullOrEmpty(topic))
            {
                return Enumerable.Empty<GetBlogDTO>();
            }

            return await _context.Blogs
                .Include(b => b.BlogImages)
                .Include(b => b.BlogViews)
                .Include(b => b.Consultant)
                .Where(b => b.PublishDate != null && b.Topic == topic && b.Status)
                .OrderByDescending(b => b.PublishDate)
                .Select(b => new GetBlogDTO
                {
                    BlogID = b.BlogId,
                    Title = b.Title ?? string.Empty,
                    Description = b.Description ?? string.Empty,
                    Topic = b.Topic ?? string.Empty,
                    PublishDate = b.PublishDate.HasValue ?
                        b.PublishDate.Value.ToDateTime(TimeOnly.MinValue) :
                        DateTime.MinValue,
                    ConsultantName = b.Consultant != null ?
                        b.Consultant.FullName ?? "Unknown" :
                        "Unknown",
                    ThumbnailImagePath = b.BlogImages.Any() ?
                        b.BlogImages.OrderBy(i => i.OrderIndex ?? 0).First().ImagePath ?? string.Empty :
                        string.Empty
                })
                .ToListAsync();
        }
        public async Task<BlogContentDTO?> GetBlogByTitleAsync(string title)
        {
            var blog = await _context.Blogs
                .Include(b => b.BlogImages)
                .Include(b => b.BlogViews)
                .Include(b => b.Consultant)
                .FirstOrDefaultAsync(b => b.Title != null && b.Title.ToLower() == title.ToLower() && b.Status);

            if (blog == null) return null;

            return new BlogContentDTO
            {
                BlogID = blog.BlogId,
                Title = blog.Title ?? string.Empty,
                Description = blog.Description ?? string.Empty,
                Content = blog.Content ?? string.Empty,
                Topic = blog.Topic ?? string.Empty,
                PublishDate = blog.PublishDate.HasValue ?
                    blog.PublishDate.Value.ToDateTime(TimeOnly.MinValue) :
                    DateTime.MinValue,
                ConsultantName = blog.Consultant != null ?
                    blog.Consultant.FullName ?? "Unknown" :
                    "Unknown",
                Images = blog.BlogImages
                    .OrderBy(i => i.OrderIndex ?? 0)
                    .Select(i => new BlogImageDTO
                    {
                        ImageID = i.ImageId,
                        ImagePath = i.ImagePath ?? string.Empty,
                        ImageCaption = i.ImageCaption ?? string.Empty,
                        UploadDate = i.UploadDate ?? DateTime.MinValue,
                        OrderIndex = i.OrderIndex ?? 0
                    }).ToList()
            };
        }

       

    }
}