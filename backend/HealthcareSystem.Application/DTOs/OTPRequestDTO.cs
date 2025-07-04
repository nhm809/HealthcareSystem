

using System;

namespace Application.DTOs
{
    public class OTPRequestDTO
    {
        public int OtpId { get; set; }

        public int? UserId { get; set; }

        public string? Code { get; set; }

        public string? Email { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? ExpiredAt { get; set; }

        public int? IsVerified { get; set; }
    }
}