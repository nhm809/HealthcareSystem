
namespace Application.DTOs
{
	public class LoginResponseDTO
	{
		public string? Token { get; set; }
		public string? Email { get; set; }
        public string? FullName { get; set; }
		public string? PhoneNumber { get; set; }
		public string? Role { get; set; }
		public string? AvatarPath { get; set; }
		public DateTime Expires { get; set; }
    }
}