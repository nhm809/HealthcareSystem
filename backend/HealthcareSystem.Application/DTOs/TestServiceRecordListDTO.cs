namespace Application.DTOs
{
    public class TestServiceRecordListDTO
    {
        public int RecordID { get; set; }
        public string? FullNameOfMember { get; set; }
        public string? ServiceName { get; set; }
        public string? Status { get; set; }
        public DateTime? RecordDate { get; set; }
    }
}
