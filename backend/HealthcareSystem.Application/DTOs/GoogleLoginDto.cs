using System.ComponentModel.DataAnnotations;

namespace Application.DTOs

{
    public class GoogleLoginDto
    {
        [Required]
        public string? IdToken { get; set; }
    }
}
