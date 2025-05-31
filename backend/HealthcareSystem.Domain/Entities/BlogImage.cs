using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class BlogImage
    {
        public int ImageId { get; set; }

        public int? BlogId { get; set; }

        public string? ImagePath { get; set; }

        public string? ImageCaption { get; set; }

        public DateTime? UploadDate { get; set; }

        public int? OrderIndex { get; set; }

        public virtual Blog? Blog { get; set; }
    }
}