using System.ComponentModel.DataAnnotations;

namespace  Application.DTOs
{
    public class TestServiceRecordDetailDTO
    {
         public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public string? ServiceName { get; set; }

        public string? Result { get; set; }

        public DateTime? RecordDate { get; set; }

        public string? Notes { get; set; }

        public string? Status { get; set; }

        public DateOnly? TestDate { get; set; }

        public TimeSpan? TimeSlot { get; set; }

        public StaffDTO? Staff {get; set; }
    }

    public class StaffDTO
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
        public List<string>? SpecialtyNames { get; set; }
    }
}