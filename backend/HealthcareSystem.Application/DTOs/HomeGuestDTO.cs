using Application.DTOs;

namespace HealthcareSystem.Application.DTOs
{
    public class HomeGuestDTO
    {
        public List<ServiceHighlightDTO> HighlightedServices { get; set; }
        public List<GetBlogDTO> HighlightedBlogs { get; set; }
    }

    public class ServiceHighlightDTO
    {
        public int ServiceId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}
