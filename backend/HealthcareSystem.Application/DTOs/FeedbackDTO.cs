

namespace Application.DTOs
{
    public class FeedbackDTO
    {
        public int? AppointmentId { get; set; }
        public int? RecordId { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? FeedbackDate { get; set; }

    }
}