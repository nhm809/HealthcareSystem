using System.ComponentModel.DataAnnotations;

public class GoogleLoginDto
{
    [Required]
    public string IdToken { get; set; }
}
