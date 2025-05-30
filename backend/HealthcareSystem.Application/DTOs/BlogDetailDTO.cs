namespace Application.DTOs
{
    public class GetBlogContentDTO
    {
        public int? BlogID { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Topic { get; set; } = null!;
        public DateTime? PublishDate { get; set; }
        public string ConsultantName { get; set; } = null!;
        public List<BlogImageDTO>? Images { get; set; } = new();
    }

    public class BlogImageDTO
    {
        public int ImageID { get; set; }
        public string ImagePath { get; set; } = null!;
        public string ImageCaption { get; set; } = null!;
        public DateTime UploadDate { get; set; }
        public int OrderIndex { get; set; }
    }
}
