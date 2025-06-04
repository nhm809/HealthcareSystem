namespace HealthcareSystem.Application.DTOs
{
    public class StaffDTO
    {
        public string? Avatar { get; set; } // lấy từ bảng User
        public int? StaffId { get; set; }
        public string? FullName { get; set; }// lấy từ bảng User
        public string? Email { get; set; }// lấy từ bảng User
        public string? SpecialtyName { get; set; } //Lấy từ bảng Specialty
    }

}