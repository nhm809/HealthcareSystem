namespace Application.DTOs
{
    public class TestServiceRecordDetailDTO
    {
        public int RecordID { get; set; }

        public string? FullNameOfMember { get; set; }

        public string? Gender { get; set; }

        public DateOnly? Dob { get; set; }

        public string? PhoneNumber { get; set; }

        public string? ServiceName { get; set; }

        public string? Result { get; set; }

        public string? Notes { get; set; }

        public string? Status { get; set; }

        public DateTime? RecordDate { get; set; }

        public string? StaffName { get; set; } // lấy từ TestServiceRecord.Staff.FullName nếu có
    }
}
