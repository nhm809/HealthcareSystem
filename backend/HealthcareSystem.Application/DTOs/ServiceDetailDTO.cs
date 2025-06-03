using System.ComponentModel.DataAnnotations;
//ServiceDetailDTO.cs push
namespace Application.DTOs
{
    public class ServiceDetailDTO
    {
        public int ServiceId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }

    }
}
