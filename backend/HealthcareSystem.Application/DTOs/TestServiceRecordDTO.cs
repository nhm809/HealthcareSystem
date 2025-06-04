using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Application.DTOs
{
    public class TestServiceRecordDTO
    {
        public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public int? MemberId { get; set; }

        public DateTime? RecordDate { get; set; }

        public string? Status { get; set; }
    }
     
}
