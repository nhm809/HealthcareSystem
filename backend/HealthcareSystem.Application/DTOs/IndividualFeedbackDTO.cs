using System;

namespace Application.DTOs
{
    public class IndividualFeedbackDTO
    {
        public int FeedbackId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}