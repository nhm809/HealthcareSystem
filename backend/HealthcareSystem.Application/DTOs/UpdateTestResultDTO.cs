namespace HealthcareSystem.Application.DTOs
{
    public class UpdateTestResultDTO
    {
        public int TestServiceRecordId { get; set; }
        public string? Result { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; }
    }
} 