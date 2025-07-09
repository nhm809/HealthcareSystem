
namespace Application.DTOs
{
    public class VerifyOtpDTO
    {
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public string Code { get; set; }
    }
}