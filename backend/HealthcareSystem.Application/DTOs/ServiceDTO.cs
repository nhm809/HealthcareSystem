using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }

        public string? Name { get; set; }

        public decimal? Price { get; set; }
    }
}
