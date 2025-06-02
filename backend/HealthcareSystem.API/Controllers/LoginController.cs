
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/login")]
public class LoginController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _config;

    public LoginController(IAuthService authService, IConfiguration config)
    {
        _authService = authService;
        _config = config;

    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        try
        {
            LoginResponseDTO response = await _authService.LoginAsync(dto);

            return Ok(new
            {
                success = true,
                token = response.Token,
                refreshToken = response.RefreshToken,
                userId = response.UserId,
                email = response.Email,
                phoneNumber = response.PhoneNumber,
                roleId = response.Role,
                avatarPath = response.AvatarPath,
                expiresAcessToken = response.ExpiresAcessToken,
                expiresRefreshToken = response.ExpiresRefreshToken,
                message = "Login successful"
            });
        }
        catch (Exception e)
        {
            return Unauthorized(new { success = false, message = e.Message });
        }
    }

}
