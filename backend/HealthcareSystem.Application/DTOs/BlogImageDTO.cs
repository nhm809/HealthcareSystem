namespace Application.DTOs
{
    public class BlogImageDTO
    {
        public int ImageID { get; set; }            // ID của ảnh
        public required string ImagePath { get; set; }  // Đường dẫn ảnh
        public required string ImageCaption { get; set; }  // Chú thích ảnh
        public DateTime UploadDate { get; set; }          // Ngày tải ảnh lên
        public int OrderIndex { get; set; }               // Thứ tự hiển thị ảnh
    }
}