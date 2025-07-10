using System;

namespace Application.DTOs
{
    // Lớp DateRangeRequestDto đại diện cho dữ liệu đầu vào khi yêu cầu theo khoảng ngày/tháng/năm.
    public class DateRangeRequestDTO
    {
        // Thuộc tính tùy chọn để lưu trữ ngày bắt đầu của khoảng thời gian.
        public DateTime? Start { get; set; }
        // Thuộc tính tùy chọn để lưu trữ ngày kết thúc của khoảng thời gian.
        public DateTime? End { get; set; }

        // Thuộc tính tùy chọn để lưu trữ tháng (ví dụ: 1-12) khi chỉ muốn tính tổng theo tháng và năm.
        public int? Month { get; set; }
        // Thuộc tính tùy chọn để lưu trữ năm khi chỉ muốn tính tổng theo năm hoặc tháng/năm.
        public int? Year { get; set; }
    }
}