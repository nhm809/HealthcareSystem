using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class Message
    {
        public int MessageId { get; set; }

        public int? QuestionId { get; set; }

        public string? Content { get; set; }

        public int? SenderId { get; set; }

        public DateTime? SentAt { get; set; }

        public virtual Question? Question { get; set; }

        public virtual User? Sender { get; set; }
    }
}