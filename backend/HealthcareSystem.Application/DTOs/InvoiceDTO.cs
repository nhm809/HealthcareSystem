using System;

namespace HealthcareSystem.Application.DTOs
{
    public class InvoiceDTO
    {
        public int InvoiceId { get; set; }
        public int? AppointmentId { get; set; }
        public int? TestServiceRecordId { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? Status { get; set; }
        public decimal? TaxRate { get; set; }
        public string? UnitPrice { get; set; }
        public DateTime? PaidAt { get; set; }
    }
} 