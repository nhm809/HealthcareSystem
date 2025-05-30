using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public int? AppointmentId { get; set; }

    public int? TestServiceRecordId { get; set; }

    public decimal? TotalAmount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? PaymentId { get; set; }

    public int? Status { get; set; }

    public decimal? TaxRate { get; set; }

    public string? UnitPrice { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Payment? Payment { get; set; }

    public virtual TestServiceRecord? TestServiceRecord { get; set; }
}
