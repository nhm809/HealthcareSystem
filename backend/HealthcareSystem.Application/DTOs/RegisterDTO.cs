using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class RegisterDTO
    {
        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string? ConfirmPassword { get; set; }
    }
}