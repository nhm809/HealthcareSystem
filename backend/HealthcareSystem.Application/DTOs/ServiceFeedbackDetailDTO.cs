using System;
using System.Collections.Generic;

namespace Application.DTOs
{
    public class ServiceFeedbackDetailDTO
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public IEnumerable<IndividualFeedbackDTO> Feedbacks { get; set; }
    }
}