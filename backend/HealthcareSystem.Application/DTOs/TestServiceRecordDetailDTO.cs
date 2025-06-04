using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Application.DTOs
{
    public class TestServiceRecordDetailDTO
    {
        public int TestServiceRecordId { get; set; }

        public int? ServiceId { get; set; }

        public string? Result { get; set; }

        public DateTime? RecordDate { get; set; }

        public string? Notes { get; set; }

        public string? Status { get; set; }

        public StaffDTO? Staff { get; set; }
    }
}