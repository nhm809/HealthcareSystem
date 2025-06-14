using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[ApiController]
[Route("api/google-login")]
public class GoogleLoginController : ControllerBase
{
    private readonly IGoogleLoginService _googleLoginService;
    private readonly IConfiguration _configuration;

    public GoogleLoginController(IGoogleLoginService googleLoginService, IConfiguration configuration)
    {
        _googleLoginService = googleLoginService;
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> ExternalLogin([FromBody] GoogleTokenRequestDTO request)
    {
        if (string.IsNullOrEmpty(request.IdToken))
        {
            return BadRequest(new { success = false, message = "ID token is required." });
        }

        var googleUser = await _googleLoginService.ValidateGoogleTokenAsync(request);
        if (googleUser == null)
        {
            return Unauthorized(new { success = false, message = "Invalid ID token." });
        }

        
        return Ok(new
        {
            success = true,
            data = googleUser
        });
    }
}   