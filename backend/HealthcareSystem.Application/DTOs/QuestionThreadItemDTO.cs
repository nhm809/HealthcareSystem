
using System;

namespace Application.DTOs
{
    public class QuestionThreadItemDTO
    {
        public int? ThreadItemId { get; set; }
        public int? QuestionId { get; set; }
        public string? QuestionText { get; set; }
        public string? AnswerText { get; set; }
        public DateTime? SentAt { get; set; }
        public DateTime? AnsweredAt { get; set; }
        public string? AttachmentPath { get; set; }
        public bool? IsAnswered { get; set; }

    }
}
