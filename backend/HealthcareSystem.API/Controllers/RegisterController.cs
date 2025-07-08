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
            var userId = await _authService.RegisterAsync(dto);

            return Ok(new
            {
                success = true,
                message = "Register successful",
                data = new { userId }
            });
        }
        catch (ArgumentException ex)
        {
            return Conflict(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

}
