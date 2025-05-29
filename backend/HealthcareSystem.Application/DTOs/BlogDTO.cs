namespace Application.DTOs
{
    public class BlogDTO
    {
        public int BlogID { get; set; }
        public required string Title { get; set; } // tiêu đề của bài blog 
        public required string Description { get; set; } // tóm tắt bài blog đó để người xem dễ biết bài blog đó có hữu ích với mình ko 
        public required string Topic { get; set; } // chủ để của bài blog 
        public DateOnly PublishDate { get; set; }
        public required string ConsultantName { get; set; }
        public required string ThumbnailImagePath { get; set; } // Ảnh ban cho bài content đó 
    }
}
