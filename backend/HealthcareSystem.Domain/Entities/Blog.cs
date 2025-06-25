using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class Blog
    {
        public int BlogId { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public string? Description { get; set; }

        public int? ConsultantId { get; set; }

        public DateOnly? PublishDate { get; set; }

        public string? Topic { get; set; }

        public virtual ICollection<BlogImage> BlogImages { get; set; } = new List<BlogImage>();

        public virtual ICollection<BlogView> BlogViews { get; set; } = new List<BlogView>();

        public virtual User? Consultant { get; set; }

        public Boolean Status { get; set; }

    }
}