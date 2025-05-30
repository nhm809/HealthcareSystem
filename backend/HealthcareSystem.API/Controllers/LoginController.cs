using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/login")]
public class LoginController : ControllerBase
{
    private readonly IAuthService _authService;

    public LoginController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        try
        {
            var isAuthenticated = await _authService.LoginAsync(dto);

            if (isAuthenticated)
            {
                return Ok(new { success = true, message = "Login successful" });
            }
            else
            {
                return Unauthorized(new { success = false, message = "Login failed" });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }
}
