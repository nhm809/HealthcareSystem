using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class Payment
    {
        public int PaymentId { get; set; }

        public string? PaymentMethod { get; set; }

        public string? TransactionId { get; set; }

        public decimal? Amount { get; set; }

        public string? BankCode { get; set; }

        public DateTime? PaidAt { get; set; }

        public string? Status { get; set; }

        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}