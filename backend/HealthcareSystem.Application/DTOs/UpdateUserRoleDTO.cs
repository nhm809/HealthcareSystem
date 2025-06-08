using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UpdateUserRoleDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public string RoleID { get; set; } 
    }
}
