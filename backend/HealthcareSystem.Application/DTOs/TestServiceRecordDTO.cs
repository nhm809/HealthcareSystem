using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Application.DTOs
{
    public class TestServiceRecordDTO
    {
        public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public string? ServiceName { get; set; }

        public int? MemberId { get; set; }

        public int? StaffId { get; set; }

        public DateTime? RecordDate { get; set; }

        public string? Status { get; set; }
    }

    public class TestServiceRecordStaffDTO
    {
        public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Gender { get; set; }

        public string? PhoneNumber { get; set; }

        public string? FullNameOfMember { get; set; }

        public int? MemberId { get; set; }

        public string? Result { get; set; }

        public int? StaffId { get; set; }

        public DateTime? RecordDate { get; set; }

        public DateOnly? TestDate { get; set; } 

        public string? Notes { get; set; }

        public string? Status { get; set; }
    }

}