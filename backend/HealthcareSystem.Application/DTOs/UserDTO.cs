using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UserDTO
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateOnly? DoB { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Avatar { get; set; }

        // Password chỉ cần trong ngữ cảnh đăng ký, không trả về cho client
        public string? Password { get; set; }

        // Các trường hệ thống có thể bỏ qua (tự động tạo)
        // public int UserId { get; set; } // Không cần trong DTO đầu vào 
        // public DateOnly? CreateDate { get; set; } // Tự động tạo khi lưu vào DB

    }
}
