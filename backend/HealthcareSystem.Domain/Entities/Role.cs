using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class Role
    {
        public string RoleId { get; set; } = null!;

        public int? UserId { get; set; }

        public string? RoleName { get; set; }

        public virtual User? User { get; set; }
    }
}