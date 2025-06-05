namespace Application.DTOs
{
	public class BlogViewDTO
	{
		public int BlogViewId { get; set; }         // ID của lượt xem
		public int MemberId { get; set; }           // ID của thành viên xem bài blog
		public int BlogId { get; set; }             // ID bài blog được xem
		public DateTime ViewDate { get; set; }      // Ngày giờ xem
	}
}