using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class BlogView
    {
        public int BlogViewId { get; set; }

        public int? MemberId { get; set; }

        public int? BlogId { get; set; }

        public DateTime? ViewDate { get; set; }

        public virtual Blog? Blog { get; set; }

        public virtual User? Member { get; set; }
    }
}