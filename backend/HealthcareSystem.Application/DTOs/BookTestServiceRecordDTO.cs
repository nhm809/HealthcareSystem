using System;
namespace Application.DTOs
{
    public class BookTestServiceRecordDTO
    {
        public int ServiceId { get; set; }
        public string FullName { get; set; }
        public DateTime Dob { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public int? MemberId { get; set; } //FE gửi cái này
    }
}
