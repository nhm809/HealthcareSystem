
namespace Application.DTOs
{
	public class LoginResponseDTO
	{
		public string? Token { get; set; }
		public string? RefreshToken { get; set; }
        public string? Email { get; set; }

		public int UserId { get; set; }

        public string? FullName { get; set; }
		public string? PhoneNumber { get; set; }
		public string? Role { get; set; }
		public string? AvatarPath { get; set; }
		public DateTime? ExpiresAcessToken { get; set; }
        public DateTime? ExpiresRefreshToken { get; set; }
    }
}