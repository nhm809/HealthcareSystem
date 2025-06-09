using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class DeleteBlogDTO
    {
        [Required]
        public int BlogID { get; set; }

        [Required]
        public int ConsultantId { get; set; } // để đảm bảo đúng người tạo mới có quyền xóa
    }
}
