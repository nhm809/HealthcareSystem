using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/register")]
public class RegisterController : ControllerBase
{
    private readonly IAuthService _authService;

    public RegisterController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
    {
        try
        {
            var isRegistered = await _authService.RegisterAsync(dto);

            if (isRegistered)
            {
                return Ok(new { success = true, message = "Register successful" });
            }
            else
            {
                return BadRequest(new { success = false, message = "Register failed" });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }
}
