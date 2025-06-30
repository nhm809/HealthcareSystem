using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class QuestionThreadItem
    {
        public int ThreadItemId { get; set; }

        public int? QuestionId { get; set; }

        public DateTime? SentAt { get; set; }

        public DateTime? AnsweredAt { get; set; }

        public string? QuestionText { get; set; }

        public string? AnswerText { get; set; }

        public string? AttachmentPath { get; set; }

        public bool? IsAnswered { get; set; }

        public virtual Question? Question { get; set; }
    }
}