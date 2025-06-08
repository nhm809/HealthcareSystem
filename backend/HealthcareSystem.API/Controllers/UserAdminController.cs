using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class UserAdminController : ControllerBase
{
    private readonly IUserAdminService _service;

    public UserAdminController(IUserAdminService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserRoleDTO>>> GetAllUsers()
    {
        var users = await _service.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPut("role")]
    public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleDTO dto)
    {
        var success = await _service.UpdateUserRoleAsync(dto);
        if (!success) return NotFound("User not found");
        return Ok("Role updated successfully");
    }
}
