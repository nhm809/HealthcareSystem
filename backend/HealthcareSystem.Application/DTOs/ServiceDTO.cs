using System.ComponentModel.DataAnnotations;
//ServiceDTO.cs push
namespace Application.DTOs
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }
        
        public decimal? Price { get; set; }
    }
    public class CreateServiceDTO
    {
        [Required(ErrorMessage = "Tên dịch vụ không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống")]
        public string Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal? Price { get; set; }

    }
}
