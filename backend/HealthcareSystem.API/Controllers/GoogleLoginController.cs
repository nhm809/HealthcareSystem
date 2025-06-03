using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/google-login")]

public class GoogleLoginController : ControllerBase
{
    private readonly IGoogleLoginService _googleLoginService;

    public GoogleLoginController(IGoogleLoginService googleLoginService)
    {
        _googleLoginService = googleLoginService;
    }

    [HttpPost]
    public async Task<IActionResult> ExternalLogin([FromBody] GoogleTokenRequestDTO request )
    {
        if (string.IsNullOrEmpty(request.IdToken))
        {
            return BadRequest("ID token is required.");
        }
        var googleUser = await _googleLoginService.ValidateGoogleTokenAsync(request);
        if (googleUser == null)
        {
            return Unauthorized("Invalid ID token.");
        }
        
        return Ok(googleUser); 
    }
}   