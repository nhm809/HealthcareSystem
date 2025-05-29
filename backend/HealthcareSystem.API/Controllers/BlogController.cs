//hiện danh sách blog và đọc blog chi tiết bao gồm cả hình ảnh 

using Microsoft.AspNetCore.Mvc;
using Application.DTOs;


namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        // danh sách blog (thử tạo)
        private static List<BlogDTO> blogList = new()
        {
           new BlogDTO
            {
                BlogID = 1,
                Title = "Tầm quan trọng của khám sức khỏe sinh sản định kỳ",
                Description = "Khám sức khỏe sinh sản định kỳ giúp phát hiện sớm các vấn đề tiềm ẩn và nâng cao chất lượng cuộc sống.",
                Topic = "Sức khỏe sinh sản",
                PublishDate = DateOnly.FromDateTime(DateTime.Now),
                ConsultantName = "BS. Nguyễn Thị Hồng",
                ThumbnailImagePath = "/images/kham-suc-khoe.jpg"
            },
            new BlogDTO
            {
                BlogID = 2,
                Title = "Các biện pháp tránh thai an toàn và hiệu quả",
                Description = "Tìm hiểu những phương pháp tránh thai hiện đại phù hợp với từng đối tượng để bảo vệ sức khỏe tình dục.",
                Topic = "Giáo dục giới tính",
                PublishDate = DateOnly.FromDateTime(DateTime.Now),
                ConsultantName = "BS. Trần Văn Minh",
                ThumbnailImagePath = "/images/tranh-thai.jpg"
            }
        };

        private static List<BlogDetailDTO> blogDetails = new()
        {
            new BlogDetailDTO
            {
                BlogID = 1,
                Title = "Tầm quan trọng của khám sức khỏe sinh sản định kỳ",
                Content = "Khám sức khỏe sinh sản định kỳ giúp phát hiện sớm các bệnh lý như viêm nhiễm, u nang, rối loạn nội tiết... Đồng thời, tư vấn chuyên môn sẽ giúp bạn có lối sống lành mạnh, kế hoạch sinh sản hợp lý và hôn nhân bền vững.",
                Topic = "Sức khỏe sinh sản",
                PublishDate = DateTime.Now.AddDays(-10),
                ConsultantName = "BS. Nguyễn Thị Hồng",
                Images = new List<BlogImageDTO>
                {
                new BlogImageDTO
                    {
                        ImageID = 1,
                        ImagePath = "/images/kham1.jpg",
                        ImageCaption = "Tư vấn sức khỏe sinh sản tại phòng khám",
                        PublishDate = DateOnly.FromDateTime(DateTime.Now),
                        OrderIndex = 1
                    }
                }
            },
            new BlogDetailDTO
            {
                BlogID = 2,
                Title = "Các biện pháp tránh thai an toàn và hiệu quả",
                Content = "Hiện nay có nhiều phương pháp tránh thai như bao cao su, thuốc tránh thai, đặt vòng, cấy que tránh thai... Mỗi phương pháp có ưu - nhược điểm riêng, và cần được tư vấn kỹ để lựa chọn phù hợp với tình trạng sức khỏe và kế hoạch gia đình của mỗi người.",
                Topic = "Giáo dục giới tính",
                PublishDate = DateTime.Now.AddDays(-6),
                ConsultantName = "BS. Trần Văn Minh",
                Images = new List<BlogImageDTO>
                {
                new BlogImageDTO
                    {
                        ImageID = 2,
                        ImagePath = "/images/tranhthai1.jpg",
                        ImageCaption = "Tư vấn các phương pháp tránh thai hiện đại",
                        PublishDate = DateOnly.FromDateTime(DateTime.Now),
                        OrderIndex = 1
                    }
                }
            }
};


        //  lấy danh sách blog
        [HttpGet]
        public IActionResult GetAllBlogs()
        {
            return Ok(blogList);
        }

        //lấy chi tiết bài blog ra 
        [HttpGet("{id}")]
        public IActionResult GetBlogDetail(int id)
        {
            var blog = blogDetails.FirstOrDefault(b => b.BlogID == id);
            if (blog == null) return NotFound("Không tìm thấy bài viết.");
            return Ok(blog);
        }
    }

    internal class BlogDetailDTO
    {
        public int BlogID { get; internal set; }
        public required string Title { get; internal set; }
        public required string Content { get; internal set; }
        public required string Topic { get; internal set; }
        public DateTime PublishDate { get; internal set; }
        public required string ConsultantName { get; internal set; }
        public required List<BlogImageDTO> Images { get; internal set; }
    }
}
