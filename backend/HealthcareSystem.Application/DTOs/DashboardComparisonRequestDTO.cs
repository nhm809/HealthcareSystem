using System;
using System.ComponentModel.DataAnnotations; // Thêm dòng này

namespace Application.DTOs
{
    public class DashboardComparisonRequestDTO
    {
        [Required(ErrorMessage = "ComparisonPeriod is required (Day, Month, Year).")]
        public string ComparisonPeriod { get; set; } // Loại so sánh: "Day", "Month", hoặc "Year"

        // Sử dụng cho ComparisonPeriod = "Day"
        public DateTime? SpecificDate { get; set; }

        // Sử dụng cho ComparisonPeriod = "Month" hoặc "Year"
        public int? Year { get; set; }

        // Sử dụng cho ComparisonPeriod = "Month"
        public int? Month { get; set; }
    }
}