namespace Application.DTOs
{
    public class CreateBlogDTO
    {
        
        public required string Title { get; set; }
        public required string? Description { get; set; }
        public required string? Content { get; set; }
        public required string? Topic { get; set; }
        
        public required int ConsultantId { get; set; }
        public required string? ThumbnailImagePath { get; set; }
    }
}
