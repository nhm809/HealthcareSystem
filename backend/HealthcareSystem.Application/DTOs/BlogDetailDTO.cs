namespace Application.DTOs
{
    public class BlogDetailDTO
    {
        public int BlogID { get; set; }
        public required string Title { get; set; } // tiêu đề của bài blog đó 
        public required string Content { get; set; }  // nội dung toàn bộ của bài blog đó 
        public required string Topic { get; set; } // chủ đề 
        public DateOnly PublishDate { get; set; }
        public required string ConsultantName { get; set; }
        public List<BlogImageDTO> Images { get; set; } = new();
    }

    public class BlogImageDTO
    {
        public int ImageID { get; set; }
        public required string ImagePath { get; set; }
        public required string ImageCaption { get; set; }
        public DateOnly PublishDate { get; set; }
        public int OrderIndex { get; set; }
    }
}
