
namespace Application.DTOs
{
    public class ChangePasswordRequestDTO
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}