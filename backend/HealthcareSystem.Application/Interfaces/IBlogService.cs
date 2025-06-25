using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IBlogService
    {
        // Lấy tất cả blog
        Task<IEnumerable<GetBlogDTO>> GetAllBlogsAsync();

        // Lấy blog theo ID
        Task<BlogContentDTO?> GetBlogContentByIdAsync(int blogId);

        // Thêm lượt xem blog (sử dụng trong Controller)
        Task AddBlogViewAsync(int blogId, int memberId);

        // Lấy các blog nổi bật
        Task<IEnumerable<GetBlogDTO>> GetPopularBlogsAsync(int count = 5);

        // Lấy blog theo chủ đề
        Task<IEnumerable<GetBlogDTO>> GetBlogsByTopicAsync(string topic);
        // Lấy blog theo Title
        Task<BlogContentDTO?> GetBlogByTitleAsync(string title);
        


    }
}