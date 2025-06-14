using System;

namespace HealthcareSystem.Application.DTOs
{
    public class BookTestServiceRecordDTO
    {
        public int ServiceId { get; set; } = 1; // Giá trị mặc định là 1
        public string FullName { get; set; }
        public DateOnly Dob { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly TestDate { get; set; }
        public int UserId { get; set; } //FE gửi cái này
    }
}