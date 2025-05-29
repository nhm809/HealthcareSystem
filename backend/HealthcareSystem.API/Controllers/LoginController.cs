using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
	private readonly IAuthService _authService;

	public LoginController(IAuthService authService)
	{
		_authService = authService;
	}

	[HttpPost("login")]
	public async Task<IActionResult> login([FormBody] LoginDTO dto)
	{
		try {
			var isAuthenticated = await _authService.LoginAsync(dto);

			if(isAuthenticated)
			{
				return Ok(new { success = true, message = "Login successful" })
			}
			else
			{
				return Unauthorized(new { success = false, message = "Login failed"});
			}
		}
		catch(Exception e)
		{
			return BadRequest(new { message = e.Message });
		}
	}
}
