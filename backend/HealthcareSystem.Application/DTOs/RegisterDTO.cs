public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string phoneNumber { get; set; }

    [Required]
    public string Password { get; set; }

    [Compare("Password", ErrorMessage = "Mat khau khong khop")]
    public string ConfirmPassword { get; set; }
}
