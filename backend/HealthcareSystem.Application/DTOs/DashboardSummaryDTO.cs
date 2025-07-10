using System;

namespace Application.DTOs // Giữ nguyên namespace bạn cung cấp
{
	// Lớp DashboardSummaryDTO đại diện cho các chỉ số tổng quan hiển thị trên Dashboard.
	public class DashboardSummaryDTO // Đã thay đổi thành DTO viết hoa
	{
		// Thuộc tính để lưu trữ tổng doanh thu trong khoảng thời gian báo cáo.
		public decimal TotalRevenue { get; set; }
		// Thuộc tính để lưu trữ phần trăm thay đổi của tổng doanh thu so với giai đoạn trước.
		public decimal TotalRevenueChangePercentage { get; set; }

		// Thuộc tính để lưu trữ tổng số lượt đăng ký dịch vụ (tư vấn + xét nghiệm).
		public int ServiceRegistrations { get; set; }
		// Thuộc tính để lưu trữ phần trăm thay đổi của số lượt đăng ký dịch vụ so với giai đoạn trước.
		public decimal ServiceRegistrationsChangePercentage { get; set; }

		// Thuộc tính để lưu trữ điểm đánh giá trung bình.
		public decimal AverageRating { get; set; }
		// Thuộc tính để lưu trữ phần trăm thay đổi của điểm đánh giá trung bình so với giai đoạn trước.
		public decimal AverageRatingChangePercentage { get; set; }

		// Thuộc tính để lưu trữ tổng số câu hỏi đã được trả lời.
		public int AnsweredQuestions { get; set; }
		// Thuộc tính để lưu trữ phần trăm thay đổi của số câu hỏi đã được trả lời so với giai đoạn trước.
		public decimal AnsweredQuestionsChangePercentage { get; set; }
	}
}