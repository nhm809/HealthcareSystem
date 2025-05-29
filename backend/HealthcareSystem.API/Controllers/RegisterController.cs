

using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
pubic class RegisterController : ControllerBase
{
    private readonly IAuthService _authService;

    public RegisterController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FormBody] RegisterDTO dto)
    {
        try
        {
            var isRegistered = await _authService.RegisterAsync(dto);

            if (isRegistered)
            {
                return Ok(new { success = true, message = "Register successful" });
            }
            else{
                return BadRequest(new { success = false, message = "Register failed" });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

}