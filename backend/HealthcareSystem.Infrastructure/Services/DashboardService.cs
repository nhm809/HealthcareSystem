using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces; // Cho IDashboardService và các DTOs
using Domain.Entities;
using Infrastructure.data; // Cho AppDbContext


namespace Infrastructure.Services
{
    // Lớp DashboardService triển khai interface IDashboardService.
    public class DashboardService : IDashboardService
    {
        // Khai báo AppDbContext để truy cập dữ liệu từ database.
        private readonly AppDbContext _context;

        // Constructor để inject (tiêm) AppDbContext cần thiết.
        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        // Triển khai phương thức GetDashboardData từ interface IDashboardService.
        public async Task<DashboardDataDTO> GetDashboardData(DateTime? startDate, DateTime? endDate)
        {
            DateTime actualStartDate; // Biến lưu ngày bắt đầu thực tế của kỳ báo cáo.
            DateTime actualEndDate;    // Biến lưu ngày kết thúc thực tế của kỳ báo cáo.
            DateTime today = DateTime.Today; // Lấy ngày hiện tại.

            // Kiểm tra xem người dùng có cung cấp startDate và endDate hay không.
            if (startDate.HasValue && endDate.HasValue)
            {
                // Nếu có, sử dụng các giá trị được cung cấp. .Date để bỏ phần thời gian.
                actualStartDate = startDate.Value.Date;
                actualEndDate = endDate.Value.Date;
            }
            else // Nếu không, sử dụng khoảng thời gian mặc định (7 ngày gần nhất).
            {
                actualEndDate = today.Date; // Ngày kết thúc mặc định là hôm nay.
                actualStartDate = today.AddDays(-6).Date; // Ngày bắt đầu mặc định là 6 ngày trước (tổng cộng 7 ngày).
            }

            // Tính toán ngày cắt dữ liệu để bao gồm cả giai đoạn so sánh.
            // dataCutoffDate là ngày ngay trước actualStartDate.
            var dataCutoffDate = actualStartDate.AddDays(-1);

            // Bắt đầu truy vấn tất cả dữ liệu thô từ các DbSet thông qua _context.
            // Đã sửa: Sử dụng .HasValue và .Value.Date để tránh lỗi null-propagating operator trong LINQ to Entities.
            var invoices = await _context.Invoices
                                .Where(i => i.CreatedAt.HasValue && i.CreatedAt.Value.Date >= dataCutoffDate.Date && i.CreatedAt.Value.Date < actualEndDate.AddDays(1).Date && i.Status == 1)
                                .ToListAsync();

            var appointments = await _context.Appointments
                                    .Where(a => a.StartTime.HasValue && a.StartTime.Value.Date >= dataCutoffDate.Date && a.StartTime.Value.Date < actualEndDate.AddDays(1).Date)
                                    .ToListAsync();

            var testRecords = await _context.TestServiceRecords
                                    .Where(t => t.RecordDate.HasValue && t.RecordDate.Value.Date >= dataCutoffDate.Date && t.RecordDate.Value.Date < actualEndDate.AddDays(1).Date)
                                    .ToListAsync();

            var feedbacks = await _context.Feedbacks
                            .Where(f => f.FeedbackDate.HasValue && f.FeedbackDate.Value.Date >= dataCutoffDate.Date && f.FeedbackDate.Value.Date < actualEndDate.AddDays(1).Date)
                            .ToListAsync();

            // q.Status == "Answered" giả định là câu hỏi đã được trả lời.
            var questions = await _context.Questions
                            .Where(q => q.SubmitDate.HasValue && q.SubmitDate.Value.Date >= dataCutoffDate.Date && q.SubmitDate.Value.Date < actualEndDate.AddDays(1).Date && q.Status == "Answered")
                            .ToListAsync();

            // Gọi phương thức CalculateSummary để tính các chỉ số tổng quan.
            var summary = CalculateSummary(invoices, appointments, testRecords, feedbacks, questions, actualStartDate, actualEndDate);
            // Gọi phương thức CalculateDailyData để tính dữ liệu cho biểu đồ hàng ngày.
            var dailyData = CalculateDailyData(invoices, appointments, testRecords, actualStartDate, actualEndDate);

            // Trả về một đối tượng DashboardDataDto chứa cả dữ liệu tổng quan và dữ liệu hàng ngày.
            return new DashboardDataDTO
            {
                Summary = summary,
                DailyData = dailyData
            };
        }

        // Triển khai phương thức GetTotalRevenueAsync với logic xử lý ngày linh hoạt.
        public async Task<TotalRevenueResponseDTO> GetTotalRevenueAsync(DateRangeRequestDTO request)
        {
            DateTime actualStartDate;
            DateTime actualEndDate;

            // Ưu tiên sử dụng Start và End nếu được cung cấp đầy đủ.
            if (request.Start.HasValue && request.End.HasValue)
            {
                actualStartDate = request.Start.Value.Date;
                actualEndDate = request.End.Value.Date;
            }
            // Nếu không có Start/End, kiểm tra Month và Year.
            else if (request.Month.HasValue && request.Year.HasValue)
            {
                // Tính toán ngày đầu tiên và ngày cuối cùng của tháng/năm đó.
                actualStartDate = new DateTime(request.Year.Value, request.Month.Value, 1);
                actualEndDate = actualStartDate.AddMonths(1).AddDays(-1); // Ngày cuối cùng của tháng.
            }
            // Nếu chỉ có Year.
            else if (request.Year.HasValue)
            {
                // Tính toán ngày đầu tiên và ngày cuối cùng của năm đó.
                actualStartDate = new DateTime(request.Year.Value, 1, 1);
                actualEndDate = new DateTime(request.Year.Value, 12, 31);
            }
            else
            {
                // Xử lý trường hợp không có đủ thông tin ngày tháng.
                throw new ArgumentException("Invalid date range parameters. Please provide Start/End, or Month/Year, or just Year.");
            }

            // Lọc hóa đơn theo khoảng thời gian đã xác định và trạng thái đã thanh toán.
            // Đã sửa: Sử dụng .HasValue và .Value.Date để tránh lỗi null-propagating operator trong LINQ to Entities.
            var filteredInvoices = await _context.Invoices
                                       .Where(i => i.CreatedAt.HasValue && i.CreatedAt.Value.Date >= actualStartDate.Date &&
                                                   i.CreatedAt.Value.Date < actualEndDate.Date.AddDays(1) &&
                                                   i.Status == 1) // Giả định Status == 1 là đã thanh toán.
                                       .ToListAsync();

            // Tính tổng doanh thu từ các hóa đơn đã lọc.
            var totalRevenue = filteredInvoices.Sum(i => i.TotalAmount ?? 0);

            // Trả về đối tượng TotalRevenueResponseDto.
            return new TotalRevenueResponseDTO
            {
                Total = totalRevenue
            };
        }

        // Phương thức private để tính toán các chỉ số tổng quan.
        // Các lọc này hoạt động trên List<T> (LINQ to Objects) nên toán tử ?. không gây lỗi.
        private DashboardSummaryDTO CalculateSummary(
            List<Invoice> invoices,
            List<Appointment> appointments,
            List<TestServiceRecord> testRecords,
            List<Feedback> feedbacks,
            List<Question> questions,
            DateTime currentPeriodStartDate,
            DateTime currentPeriodEndDate)
        {
            // Lọc dữ liệu chỉ cho giai đoạn hiện tại.
            var currentPeriodInvoices = invoices.Where(i => i.CreatedAt?.Date >= currentPeriodStartDate.Date && i.CreatedAt?.Date <= currentPeriodEndDate.Date).ToList();
            var currentPeriodAppointments = appointments.Where(a => a.StartTime?.Date >= currentPeriodStartDate.Date && a.StartTime?.Date <= currentPeriodEndDate.Date).ToList();
            var currentPeriodTestRecords = testRecords.Where(tr => tr.RecordDate?.Date >= currentPeriodStartDate.Date && tr.RecordDate?.Date <= currentPeriodEndDate.Date).ToList();
            var currentPeriodFeedbacks = feedbacks.Where(f => f.FeedbackDate?.Date >= currentPeriodStartDate.Date && f.FeedbackDate?.Date <= currentPeriodEndDate.Date).ToList();
            var currentPeriodQuestions = questions.Where(q => q.SubmitDate?.Date >= currentPeriodStartDate.Date && q.SubmitDate?.Date <= currentPeriodEndDate.Date).ToList();

            // Tính toán các chỉ số cho giai đoạn hiện tại.
            var totalRevenueCurrent = currentPeriodInvoices.Sum(i => i.TotalAmount ?? 0); // Tổng doanh thu hóa đơn.
            var serviceRegistrationsCurrent = currentPeriodAppointments.Count() + currentPeriodTestRecords.Count(); // Tổng lượt đăng ký.
            var ratingsCurrent = currentPeriodFeedbacks.Where(f => f.Rating.HasValue).Select(f => f.Rating.Value).ToList(); // Lấy tất cả rating có giá trị.
            var averageRatingCurrent = ratingsCurrent.Any() ? ratingsCurrent.Average() : 0; // Tính rating trung bình, tránh chia cho 0.
            var answeredQuestionsCurrent = currentPeriodQuestions.Count(); // Đếm số câu hỏi đã trả lời.

            // Tính toán khoảng thời gian của giai đoạn hiện tại để xác định giai đoạn so sánh.
            TimeSpan periodDuration = currentPeriodEndDate.Date - currentPeriodStartDate.Date;
            DateTime previousPeriodEndDate = currentPeriodStartDate.Date.AddDays(-1); // Ngày kết thúc giai đoạn trước đó.
            DateTime previousPeriodStartDate = previousPeriodEndDate.AddDays(-periodDuration.TotalDays); // Ngày bắt đầu giai đoạn trước đó.

            // Lọc dữ liệu cho giai đoạn so sánh.
            var previousPeriodInvoices = invoices.Where(i => i.CreatedAt?.Date >= previousPeriodStartDate.Date && i.CreatedAt?.Date <= previousPeriodEndDate.Date).ToList();
            var previousPeriodAppointments = appointments.Where(a => a.StartTime?.Date >= previousPeriodStartDate.Date && a.StartTime?.Date <= previousPeriodEndDate.Date).ToList();
            var previousPeriodTestRecords = testRecords.Where(tr => tr.RecordDate?.Date >= previousPeriodStartDate.Date && tr.RecordDate?.Date <= previousPeriodEndDate.Date).ToList();
            var previousPeriodFeedbacks = feedbacks.Where(f => f.FeedbackDate?.Date >= previousPeriodStartDate.Date && f.FeedbackDate?.Date <= previousPeriodEndDate.Date).ToList();
            var previousPeriodQuestions = questions.Where(q => q.SubmitDate?.Date >= previousPeriodStartDate.Date && q.SubmitDate?.Date <= previousPeriodEndDate.Date).ToList();

            // Tính toán các chỉ số cho giai đoạn so sánh.
            var totalRevenuePrevious = previousPeriodInvoices.Sum(i => i.TotalAmount ?? 0);
            var serviceRegistrationsPrevious = previousPeriodAppointments.Count() + previousPeriodTestRecords.Count();
            var ratingsPrevious = previousPeriodFeedbacks.Where(f => f.Rating.HasValue).Select(f => f.Rating.Value).ToList();
            var averageRatingPrevious = ratingsPrevious.Any() ? ratingsPrevious.Average() : 0;
            var answeredQuestionsPrevious = previousPeriodQuestions.Count();

            // Trả về đối tượng DashboardSummaryDto với các chỉ số hiện tại và phần trăm thay đổi.
            return new DashboardSummaryDTO
            {
                TotalRevenue = totalRevenueCurrent,
                TotalRevenueChangePercentage = CalculateChangePercentage(totalRevenueCurrent, totalRevenuePrevious),
                ServiceRegistrations = serviceRegistrationsCurrent,
                ServiceRegistrationsChangePercentage = CalculateChangePercentage(serviceRegistrationsCurrent, serviceRegistrationsPrevious),
                AverageRating = (decimal)Math.Round(averageRatingCurrent, 2), // Làm tròn 2 chữ số thập phân.
                AverageRatingChangePercentage = CalculateChangePercentage((decimal)averageRatingCurrent, (decimal)averageRatingPrevious),
                AnsweredQuestions = answeredQuestionsCurrent,
                AnsweredQuestionsChangePercentage = CalculateChangePercentage(answeredQuestionsCurrent, answeredQuestionsPrevious)
            };
        }

        // Phương thức private để tính toán dữ liệu hàng ngày cho biểu đồ.
        // Các lọc này hoạt động trên List<T> (LINQ to Objects) nên toán tử ?. không gây lỗi.
        private List<DailyDataPointDTO> CalculateDailyData(
            List<Invoice> invoices,
            List<Appointment> appointments,
            List<TestServiceRecord> testRecords,
            DateTime startDate,
            DateTime endDate)
        {
            var dailyData = new List<DailyDataPointDTO>(); // Khởi tạo danh sách để lưu trữ dữ liệu từng ngày.
            // Lặp qua từng ngày trong khoảng thời gian từ startDate đến endDate.
            for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
            {
                // Tính doanh thu tư vấn cho ngày hiện tại.
                // Lọc hóa đơn có CreatedAt là ngày hiện tại và có AppointmentId (liên quan đến tư vấn) và Status = 1.
                var consultationRevenue = invoices
                    .Where(i => i.CreatedAt?.Date == date.Date && i.AppointmentId.HasValue && i.Status == 1)
                    .Sum(i => i.TotalAmount ?? 0); // Tổng số tiền.

                // Tính doanh thu xét nghiệm cho ngày hiện tại.
                // Lọc hóa đơn có CreatedAt là ngày hiện tại và có TestServiceRecordId (liên quan đến xét nghiệm) và Status = 1.
                var testRevenue = invoices
                    .Where(i => i.CreatedAt?.Date == date.Date && i.TestServiceRecordId.HasValue && i.Status == 1)
                    .Sum(i => i.TotalAmount ?? 0);

                // Đếm số lượt đăng ký tư vấn trong ngày hiện tại.
                var consultationRegistrations = appointments.Count(a => a.StartTime?.Date == date.Date);
                // Đếm số lượt đăng ký xét nghiệm trong ngày hiện tại.
                var testRegistrations = testRecords.Count(tr => tr.RecordDate?.Date == date.Date);

                // Thêm điểm dữ liệu của ngày hiện tại vào danh sách.
                dailyData.Add(new DailyDataPointDTO
                {
                    Date = date,
                    ConsultationRevenue = consultationRevenue,
                    TestRevenue = testRevenue,
                    ConsultationRegistrations = consultationRegistrations,
                    TestRegistrations = testRegistrations
                });
            }
            return dailyData; // Trả về danh sách dữ liệu hàng ngày.
        }

        // Phương thức private tiện ích để tính toán phần trăm thay đổi giữa hai giá trị.
        private decimal CalculateChangePercentage<T>(T current, T previous) where T : struct, IComparable, IConvertible
        {
            dynamic dCurrent = current; // Chuyển đổi sang dynamic để thực hiện các phép toán.
            dynamic dPrevious = previous;

            // Xử lý trường hợp previous là 0 để tránh lỗi chia cho 0.
            if (dPrevious == 0)
            {
                // Nếu cả current và previous đều 0, không có thay đổi (0%).
                // Nếu previous là 0 nhưng current > 0, tăng trưởng 100% (từ 0 lên một giá trị).
                return dCurrent == 0 ? 0 : 100;
            }
            // Công thức tính phần trăm thay đổi.
            return ((dCurrent - dPrevious) / dPrevious) * 100;
        }
        // Phương thức mới để so sánh doanh thu giữa hai khoảng thời gian.
        public async Task<RevenueComparisonDTO> GetRevenueComparisonAsync(DashboardComparisonRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.ComparisonPeriod))
            {
                throw new ArgumentException("ComparisonPeriod must be specified (Day, Month, Year).");
            }

            DateTime currentStartDate, currentEndDate;
            DateTime previousStartDate, previousEndDate;

            // Xác định khoảng thời gian dựa trên ComparisonPeriod và các trường Year/Month/SpecificDate
            switch (request.ComparisonPeriod.ToLower())
            {
                case "day":
                    if (!request.SpecificDate.HasValue)
                    {
                        throw new ArgumentException("For 'Day' comparison, 'SpecificDate' must be provided.");
                    }
                    currentStartDate = request.SpecificDate.Value.Date;
                    currentEndDate = request.SpecificDate.Value.Date;
                    previousStartDate = currentStartDate.AddDays(-1);
                    previousEndDate = currentStartDate.AddDays(-1);
                    break;
                case "month":
                    if (!request.Year.HasValue || !request.Month.HasValue)
                    {
                        throw new ArgumentException("For 'Month' comparison, 'Year' and 'Month' must be provided.");
                    }
                    currentStartDate = new DateTime(request.Year.Value, request.Month.Value, 1);
                    currentEndDate = currentStartDate.AddMonths(1).AddDays(-1); // Ngày cuối cùng của tháng hiện tại
                    previousStartDate = currentStartDate.AddMonths(-1);
                    previousEndDate = previousStartDate.AddMonths(1).AddDays(-1); // Ngày cuối cùng của tháng trước đó
                    break;
                case "year":
                    if (!request.Year.HasValue)
                    {
                        throw new ArgumentException("For 'Year' comparison, 'Year' must be provided.");
                    }
                    currentStartDate = new DateTime(request.Year.Value, 1, 1);
                    currentEndDate = new DateTime(request.Year.Value, 12, 31);
                    previousStartDate = new DateTime(request.Year.Value - 1, 1, 1);
                    previousEndDate = new DateTime(request.Year.Value - 1, 12, 31);
                    break;
                default:
                    throw new ArgumentException("Invalid ComparisonPeriod. Supported values are 'Day', 'Month', 'Year'.");
            }

            // Fetch invoices for current period
            var currentPeriodInvoices = await _context.Invoices
                .Where(i => i.Status == 1 && // Only paid invoices
                            i.CreatedAt.HasValue &&
                            i.CreatedAt.Value.Date >= currentStartDate &&
                            i.CreatedAt.Value.Date <= currentEndDate)
                .ToListAsync();

            decimal currentRevenue = currentPeriodInvoices.Sum(i => i.TotalAmount ?? 0);

            // Fetch invoices for previous period
            var previousPeriodInvoices = await _context.Invoices
                .Where(i => i.Status == 1 && // Only paid invoices
                            i.CreatedAt.HasValue &&
                            i.CreatedAt.Value.Date >= previousStartDate &&
                            i.CreatedAt.Value.Date <= previousEndDate)
                .ToListAsync();

            decimal previousRevenue = previousPeriodInvoices.Sum(i => i.TotalAmount ?? 0);

            // Calculate percentage change
            decimal percentageChange = CalculateChangePercentage(currentRevenue, previousRevenue);

            string changeDescription;
            if (previousRevenue == 0 && currentRevenue == 0)
            {
                changeDescription = "không có doanh thu ở cả hai kỳ";
            }
            else if (previousRevenue == 0 && currentRevenue > 0)
            {
                changeDescription = $"không tăng không giảm so với {(request.ComparisonPeriod.ToLower() == "day" ? "ngày" : request.ComparisonPeriod.ToLower() == "month" ? "tháng" : "năm")} trước (có doanh thu mới)";
            }
            else if (percentageChange > 0)
            {
                changeDescription = $"tăng {Math.Round(percentageChange, 2)}% so với {(request.ComparisonPeriod.ToLower() == "day" ? "ngày" : request.ComparisonPeriod.ToLower() == "month" ? "tháng" : "năm")} trước";
            }
            else if (percentageChange < 0)
            {
                changeDescription = $"giảm {Math.Round(Math.Abs(percentageChange), 2)}% so với {(request.ComparisonPeriod.ToLower() == "day" ? "ngày" : request.ComparisonPeriod.ToLower() == "month" ? "tháng" : "năm")} trước";
            }
            else // percentageChange == 0 (bao gồm cả trường hợp previousRevenue > 0 và currentRevenue = previousRevenue)
            {
                changeDescription = "không thay đổi so với kỳ trước";
            }

            return new RevenueComparisonDTO
            {
                ComparisonPeriod = request.ComparisonPeriod,
                CurrentPeriodRevenue = currentRevenue,
                PreviousPeriodRevenue = previousRevenue,
                PercentageChange = percentageChange,
                ChangeDescription = changeDescription
            };
        }


    }
}