using System;

namespace Application.DTOs
{
    public class QuestionDTO
    {
        public int QuestionId { get; set; }

        public int? MemberId { get; set; }

        public int? SpecialtyId { get; set; }

        public string? TitleQuestion { get; set; }

        public string? Content { get; set; }

        public string? AttachmentPath { get; set; }

        public DateTime? SubmitDate { get; set; }

        public int? ConsultantId { get; set; }

        public string? Status { get; set; }

        public int? Age { get; set; }

        public string? Gender { get; set; }

        public bool? Heart { get; set; }

        public int? AnsCount { get; set; }

    }
}