using System;

namespace HealthcareSystem.Application.DTOs
{
    public class BookTestServiceRecordDTO
    {
        public int ServiceId { get; set; } // Giá trị mặc định là 1
        public string FullName { get; set; } = string.Empty;
        public DateOnly Dob { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateOnly TestDate { get; set; }
        public int UserId { get; set; } 
        public int Shift { get; set; } 
    }
}