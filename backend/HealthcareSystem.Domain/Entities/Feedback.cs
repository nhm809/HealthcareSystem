using System;
using System.Collections.Generic;

namespace HealthcareSystem.Domain.Entities;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? AppointmentId { get; set; }

    public int? RecordId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public DateOnly? FeedbackDate { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual TestServiceRecord? Record { get; set; }
}
