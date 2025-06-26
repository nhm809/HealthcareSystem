using Application.DTOs;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

public class BlogManageService : IBlogManageService
{
    private readonly AppDbContext _context;

    public BlogManageService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetBlogDTO>> GetBlogsByConsultantIdAsync(int consultantId)
    {
        return await _context.Blogs
            .Where(b => b.ConsultantId == consultantId && b.Status)
            .Include(b => b.Consultant)
            .Include(b => b.BlogImages)
            .OrderByDescending(b => b.PublishDate)
            .Select(b => new GetBlogDTO
            {
                BlogID = b.BlogId,
                Title = b.Title,
                Description = b.Description,
                Topic = b.Topic,
                PublishDate = b.PublishDate.HasValue ? b.PublishDate.Value.ToDateTime(TimeOnly.MinValue) : null,
                ConsultantName = b.Consultant != null ? b.Consultant.FullName ?? "Không rõ" : "Không xác định",
                ThumbnailImagePath = b.BlogImages
        .OrderBy(i => i.OrderIndex)
        .Select(i => i.ImagePath)
        .FirstOrDefault() ?? ""
            })
            .ToListAsync();
    }

    public async Task<GetBlogDTO?> GetBlogByIdAsync(int blogId)
    {
        var blog = await _context.Blogs
            .Include(b => b.Consultant)
            .Include(b => b.BlogImages)
            .FirstOrDefaultAsync(b => b.BlogId == blogId);

        if (blog == null) return null;

        return new GetBlogDTO
        {
            BlogID = blog.BlogId,
            Title = blog.Title,
            Description = blog.Description,
            Topic = blog.Topic,
            PublishDate = blog.PublishDate.HasValue ? blog.PublishDate.Value.ToDateTime(TimeOnly.MinValue) : null,
            ConsultantName = blog.Consultant?.FullName ?? "Không rõ",
            ThumbnailImagePath = blog.BlogImages.OrderBy(i => i.OrderIndex).FirstOrDefault()?.ImagePath ?? string.Empty
        };
    }

    public async Task<int> CreateBlogAsync(CreateBlogDTO dto)
    {
        var blog = new Blog
        {
            Title = dto.Title,
            Description = dto.Description,
            Content = dto.Content,
            Topic = dto.Topic,
            ConsultantId = dto.ConsultantId,
            PublishDate = DateOnly.FromDateTime(DateTime.UtcNow),
            Status = true
        };

        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(dto.ThumbnailImagePath))
        {
            var image = new BlogImage
            {
                BlogId = blog.BlogId,
                ImagePath = dto.ThumbnailImagePath,
                UploadDate = DateTime.UtcNow,
                OrderIndex = 1,
                ImageCaption = "Thumbnail"
            };
            _context.BlogImages.Add(image);
            await _context.SaveChangesAsync();
        }

        return blog.BlogId;
    }
    public async Task<bool> UpdateBlogAsync(UpdateBlogDTO dto)
    {
        var blog = await _context.Blogs.FindAsync(dto.BlogID);
        if (blog == null) return false;

        blog.Title = dto.Title;
        blog.Description = dto.Description;
        blog.Content = dto.Content;
        blog.Topic = dto.Topic;

        if (!string.IsNullOrWhiteSpace(dto.ThumbnailImagePath))
        {
            // cập nhật thumbnail: thay thế ảnh cũ nếu có OrderIndex = 1
            var oldThumbnail = await _context.BlogImages
                .FirstOrDefaultAsync(i => i.BlogId == blog.BlogId && i.OrderIndex == 1);

            if (oldThumbnail != null)
            {
                oldThumbnail.ImagePath = dto.ThumbnailImagePath;
                oldThumbnail.UploadDate = DateTime.UtcNow;
            }
            else
            {
                _context.BlogImages.Add(new BlogImage
                {
                    BlogId = blog.BlogId,
                    ImagePath = dto.ThumbnailImagePath,
                    UploadDate = DateTime.UtcNow,
                    OrderIndex = 1,
                    ImageCaption = "Thumbnail"
                });
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteBlogAsync(DeleteBlogDTO dto)
    {
        var blog = await _context.Blogs
            .FirstOrDefaultAsync(b => b.BlogId == dto.BlogID && b.ConsultantId == dto.ConsultantId);

        if (blog == null) return false;

        blog.Status = false;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<GetBlogDTO>> GetDeletedBlogsByConsultantIdAsync(int consultantId)
    {
        return await _context.Blogs
            .Where(b => b.ConsultantId == consultantId && !b.Status)
            .Include(b => b.Consultant)
            .Include(b => b.BlogImages)
            .OrderByDescending(b => b.PublishDate)
            .Select(b => new GetBlogDTO
            {
                BlogID = b.BlogId,
                Title = b.Title,
                Description = b.Description,
                Topic = b.Topic,
                PublishDate = b.PublishDate.HasValue ? b.PublishDate.Value.ToDateTime(TimeOnly.MinValue) : null,
                ConsultantName = b.Consultant != null ? b.Consultant.FullName ?? "Không rõ" : "Không xác định",
                ThumbnailImagePath = b.BlogImages
                    .OrderBy(i => i.OrderIndex)
                    .Select(i => i.ImagePath)
                    .FirstOrDefault() ?? ""
            })
            .ToListAsync();
    }

    public async Task<bool> RestoreBlogAsync(int blogId, int consultantId)
    {
        var blog = await _context.Blogs
            .FirstOrDefaultAsync(b => b.BlogId == blogId && b.ConsultantId == consultantId);

        if (blog == null) return false;

        blog.Status = true;
        await _context.SaveChangesAsync();
        return true;
    }
}
