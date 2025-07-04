using System;

namespace Application.DTOs
{
    public class AppointmentCreateDto
    {
        public int MemberId { get; set; }
        public int ServiceId { get; set; }
        public int ConsultantId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        /// <summary>
        /// Đường link cuộc họp (nếu có), ví dụ: "https://meet.link/abc123"
        /// KHÔNG bắt buộc: có thể để null hoặc rỗng nếu chưa có link.
        /// </summary>
        public string? MeetLink { get; set; }
        public string? Symptoms { get; set; } // Add this line
    }
}
