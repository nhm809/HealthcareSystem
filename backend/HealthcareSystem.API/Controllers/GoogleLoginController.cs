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

        // Generate JWT token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, googleUser.Sub),
                new Claim(ClaimTypes.Email, googleUser.Email),
                new Claim(ClaimTypes.Name, googleUser.FullName)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var refreshToken = Guid.NewGuid().ToString();

        return Ok(new
        {
            success = true,
            data = new
            {
                token = tokenHandler.WriteToken(token),
                refreshToken = refreshToken,
                user = new
                {
                    id = googleUser.Sub,
                    email = googleUser.Email,
                    fullName = googleUser.FullName,
                    avatarPath = googleUser.Picture,
                    roleId = "MB", // Default role for Google users
                    phoneNumber = "" // Can be updated later
                }
            }
        });
    }
}   