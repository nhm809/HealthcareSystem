namespace Application.DTOs
{
    public class GetBlogDTO
    {
        public int BlogID { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Topic { get; set; }
        public DateTime PublishDate { get; set; }
        public required string ConsultantName { get; set; }
        public required string ThumbnailImagePath { get; set; } // ảnh đại cho bài blog 
    }
}
