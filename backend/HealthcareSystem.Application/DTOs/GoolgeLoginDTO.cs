
namespace Application.DTOs
{
    public class GoogleLoginDTO
    {
        public string sub { get; set; }
        public string name { get; set; } // FullName
        public string picture { get; set; } // ProfilePicture
        public string email { get; set; } // Email
        public bool email_verified { get; set; } // EmailVerified
        public string locale { get; set; } // Locale
    }
}