namespace Application.DTOs
{
    public class ServiceSummaryDTO
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public int FeedbackCount { get; set; }
        public double AverageRating { get; set; }
    }
}