using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class Question
    {
        public int QuestionId { get; set; }

        public int? MemberId { get; set; }

        public string? Specialty { get; set; }

        public string? TitleQuestion { get; set; }

        public string? Content { get; set; }

        public string? AttachmentPath { get; set; }

        public DateTime? SubmitDate { get; set; }

        public int? ConsultantId { get; set; }

        public string? Status { get; set; }

        public virtual User? Consultant { get; set; }

        public virtual User? Member { get; set; }

        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}