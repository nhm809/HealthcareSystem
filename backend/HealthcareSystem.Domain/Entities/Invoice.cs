using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities {
    public partial class Invoice
    {
        public int InvoiceId { get; set; }

        public int? AppointmentId { get; set; }

        public int? TestServiceRecordId { get; set; }

        public decimal? TotalAmount { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string? PaymentMethod { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string? TransactionId { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int? Status { get; set; }

        public decimal? TaxRate { get; set; }

        public string? UnitPrice { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? PaidAt { get; set; }

        public virtual Appointment? Appointment { get; set; }

        public virtual TestServiceRecord? TestServiceRecord { get; set; }
    }
}