using Application.DTOs;

public interface IBlogManageService
{
    Task<List<GetBlogDTO>> GetBlogsByConsultantIdAsync(int consultantId);
    Task<GetBlogDTO?> GetBlogByIdAsync(int blogId);
    Task<int> CreateBlogAsync(CreateBlogDTO dto);

    Task<bool> UpdateBlogAsync(UpdateBlogDTO dto);
    Task<bool> DeleteBlogAsync(DeleteBlogDTO dto);
    Task<List<GetBlogDTO>> GetDeletedBlogsByConsultantIdAsync(int consultantId);
    Task<bool> RestoreBlogAsync(int blogId, int consultantId);
}
