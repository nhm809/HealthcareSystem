using System.ComponentModel.DataAnnotations;
//ServiceDTO.cs push
namespace Application.DTOs
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }

        public string? Name { get; set; }

        public decimal? Price { get; set; }
    }
}
