using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/blogs")]
    
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        // Constructor injection: inject IBlogService vào controller
        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        // Phương thức GET để lấy tất cả các bài blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetBlogDTO>>> GetAllBlogs()
        {
            try
            {
                var blogs = await _blogService.GetAllBlogsAsync();
                return Ok(blogs); // Trả về danh sách các blog
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Phương thức GET để lấy chi tiết bài blog theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogContentDTO>> GetBlogById(int id)
        {
            try
            {
                var blog = await _blogService.GetBlogContentByIdAsync(id);

                if (blog == null)
                {
                    return NotFound(); // Nếu không tìm thấy bài blog
                }

                // Giả sử lấy `MemberId` từ Session hoặc Token
                int memberId = 1;  // Thay thế bằng cách lấy MemberId thực tế từ request hoặc session

                // Thêm một lượt xem cho blog
                await _blogService.AddBlogViewAsync(id, memberId);

                return Ok(blog); // Trả về chi tiết bài blog
            }
            catch (Exception ex)
            {
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, $"Internal server error: {message}");
            }

        }

        // Phương thức GET để lấy các blog nổi bật (Popular Blogs)
        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<GetBlogDTO>>> GetPopularBlogs([FromQuery] int count = 5)
        {
            try
            {
                var popularBlogs = await _blogService.GetPopularBlogsAsync(count);
                return Ok(popularBlogs); // Trả về các blog phổ biến
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Phương thức GET để lấy các blog theo chủ đề
        [HttpGet("topic/{topic}")]
        public async Task<ActionResult<IEnumerable<GetBlogDTO>>> GetBlogsByTopic(string topic)
        {
            try
            {
                var blogsByTopic = await _blogService.GetBlogsByTopicAsync(topic);
                return Ok(blogsByTopic); // Trả về các blog theo chủ đề
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("title/{title}")]
        public async Task<ActionResult<BlogContentDTO>> GetBlogByTitle(string title)
{
    try
    {
        var blog = await _blogService.GetBlogByTitleAsync(title);

        if (blog == null)
        {
            return NotFound();
        }

        // Giả sử lấy MemberId = 1 để demo
        int memberId = 1;
        await _blogService.AddBlogViewAsync(blog.BlogID, memberId);

        return Ok(blog);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}
        


    }
}