
using System;

namespace Application.DTOs
{
    public class QuestionDTO
    {
        public int QuestionId { get; set; }

        public int? MemberId { get; set; }

        public string? Specialty { get; set; }

        public string? TitleQuestion { get; set; }

        public string? Content { get; set; }

        public string? AttachmentPath { get; set; }

        public DateTime? SubmitDate { get; set; }

        public int? ConsultantId { get; set; }

        public bool? IsAnswered { get; set; }

    }
}