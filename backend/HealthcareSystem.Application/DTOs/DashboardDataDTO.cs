using System.Collections.Generic; // Cần thiết cho kiểu dữ liệu List

// Đảm bảo namespace này TRÙNG KHỚP chính xác với namespace của DashboardSummaryDTO và DailyDataPointDTO
namespace Application.DTOs
{
    // Lớp DashboardDataDTO là DTO tổng hợp chứa tất cả dữ liệu cần thiết cho Dashboard.
    public class DashboardDataDTO // Đã thay đổi thành DTO viết hoa
    {
        // Thuộc tính để lưu trữ đối tượng chứa các chỉ số tổng quan.
        public DashboardSummaryDTO Summary { get; set; } // Đã đổi tên lớp thành DashboardSummaryDTO
        // Thuộc tính để lưu trữ danh sách các điểm dữ liệu hàng ngày cho biểu đồ.
        public List<DailyDataPointDTO> DailyData { get; set; } // Đã đổi tên lớp thành DailyDataPointDTO
    }
}