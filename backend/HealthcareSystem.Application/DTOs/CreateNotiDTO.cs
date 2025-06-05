

using System;

namespace Application.DTOs
{
    public class CreateNotiDTO
    {
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime? SendTime { get; set; }
        public bool? IsRead { get; set; }
    }
}