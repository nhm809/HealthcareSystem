
using System;

namespace Application.DTOs
{
    public class MessageDTO
    {
        public int? QuestionId { get; set; }
        public string? Content { get; set; }
        public int? SenderId { get; set; }
        public DateTime? SentAt { get; set; }
    }
}
