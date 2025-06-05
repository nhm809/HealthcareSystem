namespace Application.DTOs
{
	public class GetBlogSummaryDTO
	{
		public int BlogID { get; set; }              // ID của bài blog
		public required string Title { get; set; }   // Tiêu đề bài blog
		public required string Description { get; set; } // Tóm tắt bài blog
		public DateTime PublishDate { get; set; }    // Ngày xuất bản
		public required string ConsultantName { get; set; }  // Tên người tư vấn
		public required string ThumbnailImagePath { get; set; } // Ảnh đại diện bài blog
	}
}