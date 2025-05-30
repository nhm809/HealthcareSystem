
namespace Application.DTOs
{
	public class LoginResponseDTO
	{
		public bool Success { get; set; }
		public string? Token { get; set; }
		public string? FullName { get; set; }
		public string? PhoneNumber { get; set; }
		public string? Role { get; set; }
		public string? AvatarPath { get; set; }
	}
}