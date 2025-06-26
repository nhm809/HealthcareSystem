using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class ConsultantBlogController : ControllerBase
{
    private readonly IBlogManageService _service;

    public ConsultantBlogController(IBlogManageService service)
    {
        _service = service;
    }

    [HttpGet("consultant/{consultantId}")]
    public async Task<ActionResult<List<GetBlogDTO>>> GetAll(int consultantId)
    {
        var blogs = await _service.GetBlogsByConsultantIdAsync(consultantId);
        return Ok(blogs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetBlogDTO>> Get(int id)
    {
        var blog = await _service.GetBlogByIdAsync(id);
        if (blog == null) return NotFound();
        return Ok(blog);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateBlog([FromBody] CreateBlogDTO dto)
    {
        var blogId = await _service.CreateBlogAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = blogId }, blogId);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBlog([FromBody] UpdateBlogDTO dto)
    {
        await _service.UpdateBlogAsync(dto);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBlog([FromBody] DeleteBlogDTO dto)
    {
        var success = await _service.DeleteBlogAsync(dto);
        if (!success) return Forbid();
        return Ok();
    }

    [HttpGet("deleted/{consultantId}")]
    public async Task<ActionResult<List<GetBlogDTO>>> GetDeletedBlogs(int consultantId)
    {
        var blogs = await _service.GetDeletedBlogsByConsultantIdAsync(consultantId);
        return Ok(blogs);
    }

    [HttpPatch("restore")]
    public async Task<IActionResult> RestoreBlog([FromQuery] int blogId, [FromQuery] int consultantId)
    {
        var success = await _service.RestoreBlogAsync(blogId, consultantId);
        if (!success) return Forbid();
        return Ok();
    }
}
