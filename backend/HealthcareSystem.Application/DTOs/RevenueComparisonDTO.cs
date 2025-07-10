namespace Application.DTOs
{
    public class RevenueComparisonDTO
    {
        public string ComparisonPeriod { get; set; } // "Day", "Month", "Year"
        public decimal CurrentPeriodRevenue { get; set; }
        public decimal PreviousPeriodRevenue { get; set; }
        public decimal PercentageChange { get; set; } // Phần trăm thay đổi
        public string ChangeDescription { get; set; }
    }
}