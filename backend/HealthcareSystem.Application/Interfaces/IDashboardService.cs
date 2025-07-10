using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
namespace Application.Interfaces
{// Interface IDashboardService định nghĩa các hoạt động mà DashboardService phải triển khai.
    public interface IDashboardService
    {
        // Phương thức để lấy dữ liệu Dashboard, chấp nhận khoảng thời gian bắt đầu và kết thúc tùy chọn.
        // Task<DashboardDataDto> cho biết phương thức này là bất đồng bộ và sẽ trả về DashboardDataDto.
        Task<DashboardDataDTO> GetDashboardData(DateTime? startDate, DateTime? endDate);

        // CẬP NHẬT: Phương thức để lấy tổng doanh thu với các tham số linh hoạt hơn (DateRangeRequestDto).
        Task<TotalRevenueResponseDTO> GetTotalRevenueAsync(DateRangeRequestDTO request);

        // Phương thức mới để so sánh doanh thu
        Task<RevenueComparisonDTO> GetRevenueComparisonAsync(DashboardComparisonRequestDTO request);
    }
}