using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UpdateBlogDTO
    {
        [Required]
        public int BlogID { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public string? Content { get; set; }

        public string? Topic { get; set; }

        public string? ThumbnailImagePath { get; set; } // đường dẫn ảnh mới nếu có cập nhật
    }
}
