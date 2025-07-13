using System;
using System.Collections.Generic;

namespace Domain.Entities
{

    public partial class Specialty
    {
        public int SpecialtyId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public bool IsDeleted { get; set; } = false;

        public virtual ICollection<User> Users { get; set; } = new List<User>();

        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    }
}