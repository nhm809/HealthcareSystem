using System;

namespace Application.DTOs
{
   
    
        public class AppointmentDetailDto
        {
            public int AppointmentId { get; set; }
            public int MemberId { get; set; }
            public string MemberName { get; set; }
            public int ConsultantId { get; set; }
            public string ConsultantName { get; set; }
            public int ServiceId { get; set; }
            public string ServiceName { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string? MeetLink { get; set; }
            public string Status { get; set; }
            public string? Symptoms { get; set; } // triệu chứng
        }
    

}
