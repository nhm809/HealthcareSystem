
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;


[ApiController]
[Route("api/user-info")]

public class GetUserInfoController : ControllerBase
{
    private readonly IUserService _userService;
    public GetUserInfoController(IUserService userService)
    {
        _userService = userService;
    }


    [HttpGet("{userId}")]
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
}
