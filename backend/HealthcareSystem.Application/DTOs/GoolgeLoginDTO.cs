
namespace Application.DTOs
{
    public class GoogleLoginDTO
    {
        public int? UserId { get; set; } // UserId
        public string? Sub { get; set; }
        public string? FullName { get; set; } // FullName
        public string? Picture { get; set; } // ProfilePicture
        public string? Email { get; set; } // Email
        public bool? Email_verified { get; set; } // EmailVerified
        public string? Locale { get; set; } // Locale
    }
}