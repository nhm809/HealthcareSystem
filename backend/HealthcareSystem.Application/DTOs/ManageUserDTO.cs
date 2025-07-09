
namespace Application.DTOs
{
    public class ManageUserDTO
    {
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public string? RoleId { get; set; }
        public string? FullName { get; set; }
        public bool? IsAvailable { get; set; }
        public string? PhoneNumber { get; set; }
        public DateOnly? CreateDate { get; set; }
        public int? SpecialtyId { get; set; }
    }
}