using System;
using System.Collections.Generic;

namespace HealthcareSystem.Domain.Entities;

public partial class Otprequest
{
    public int Otpid { get; set; }

    public int? UserId { get; set; }

    public string? Code { get; set; }

    public string? Email { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public int? IsVerified { get; set; }

    public virtual User? User { get; set; }
}
