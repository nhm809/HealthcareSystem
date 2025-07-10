using System; // Cần thiết cho kiểu dữ liệu DateTime

// Đảm bảo namespace này TRÙNG KHỚP chính xác với namespace của DashboardSummaryDTO và DashboardDataDTO
namespace Application.DTOs
{
    // Lớp DailyDataPointDTO đại diện cho một điểm dữ liệu của một ngày cụ thể trên biểu đồ.
    public class DailyDataPointDTO // Đã thay đổi thành DTO viết hoa
    {
        // Thuộc tính để lưu trữ ngày của điểm dữ liệu này.
        public DateTime Date { get; set; }
        // Thuộc tính để lưu trữ doanh thu từ các dịch vụ tư vấn trong ngày này.
        public decimal ConsultationRevenue { get; set; }
        // Thuộc tính để lưu trữ doanh thu từ các dịch vụ xét nghiệm trong ngày này.
        public decimal TestRevenue { get; set; }
        // Thuộc tính để lưu trữ số lượt đăng ký tư vấn trong ngày này.
        public int ConsultationRegistrations { get; set; }
        // Thuộc tính để lưu trữ số lượt đăng ký xét nghiệm trong ngày này.
        public int TestRegistrations { get; set; }
    }
}