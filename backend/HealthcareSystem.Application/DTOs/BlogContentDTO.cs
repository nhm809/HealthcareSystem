namespace Application.DTOs
{
    public class BlogContentDTO
    {
        public int BlogID { get; set; }             // ID của bài blog
        public required string Title { get; set; }  // Tiêu đề của bài blog
        public required string Content { get; set; } // Nội dung bài blog
        public required string Topic { get; set; }  // Chủ đề của bài blog
        public DateTime PublishDate { get; set; }   // Ngày xuất bản
        public required string ConsultantName { get; set; }  // Tên người tư vấn
        public List<BlogImageDTO> Images { get; set; } = new(); // Danh sách các ảnh đi kèm bài blog
        public string Description { get; set; } = string.Empty;
    }

   
}