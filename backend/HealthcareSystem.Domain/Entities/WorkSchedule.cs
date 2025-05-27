using System;
using System.Collections.Generic;

namespace HealthcareSystem.Domain.Entities;

public partial class WorkSchedule
{
    public int WorkScheduleId { get; set; }

    public int? ConsultantId { get; set; }

    public DateOnly? WorkDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public string? ShiftType { get; set; }

    public string? Note { get; set; }

    public virtual User? Consultant { get; set; }
}
