
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using System.Threading.Tasks;
using Application.DTOs;


[ApiController]
[Route("api/user/")]

public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }


    [HttpGet("get/{userId}")]
    public async Task<IActionResult> GetUserInfo(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID cannot be null or empty.");
        }

        var userInfo = await _userService.GetUserInfo(userId);

        if (userInfo == null)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok(userInfo);
    }

    [HttpPut("update/{userId}")]
    public async Task<IActionResult> UpdateUserInfo(int userId, [FromBody] UserDTO dto)
    {
        if (dto == null)
        {
            return BadRequest("User data cannot be null.");
        }
        var result = await _userService.UpdateUserInfo(userId, dto);
        if (!result)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok(result);
    }
    [HttpPost("change-password/{userId}")]
    public async Task<IActionResult> ChangePassword(int userId, [FromBody] ChangePasswordRequestDTO dto)
    {
        if (userId <= 0 || string.IsNullOrEmpty(dto.OldPassword) || string.IsNullOrEmpty(dto.NewPassword))
        {
            return BadRequest("User ID and password data cannot be null or empty.");
        }
        var result = await _userService.ChangePassword(userId, dto);
        if (!result)
        {
            return NotFound($"User with ID {userId} not found or password change failed.");
        }
        return Ok(result);
    }
}
