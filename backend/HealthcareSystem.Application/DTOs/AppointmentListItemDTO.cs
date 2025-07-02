using System;

namespace Application.DTOs
{
    public class AppointmentListItemDto
    {
        public int AppointmentId { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; }            // ví dụ lấy tên user từ bảng User
        public int ConsultantId { get; set; }
        public string ConsultantName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? MeetLink { get; set; }
        public string Status { get; set; }
        public string? Symptoms { get; set; } // triệu chứng
    }
}
