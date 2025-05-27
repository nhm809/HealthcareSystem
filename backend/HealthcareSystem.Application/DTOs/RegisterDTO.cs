public class RegisterDTO
{
    [Required, EmailAddress]
    public string Email { get; set; }

    [Required, Phone]
    public string phoneNumber { get; set; }

    [Required]
    public string Password { get; set; }

    [Compare("Password", ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; }
}