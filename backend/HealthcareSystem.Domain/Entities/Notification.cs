using System;
using System.Collections.Generic;

namespace HealthcareSystem.Domain.Entities;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? UserId { get; set; }

    public string? Type { get; set; }

    public string? Content { get; set; }

    public DateTime? SendTime { get; set; }

    public string? Status { get; set; }

    public virtual User? User { get; set; }
}
