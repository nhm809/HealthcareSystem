
namespace Application.DTOs;

public class UserInfoDTO
{
    public int UserId { get; set; }
    public string? Provider { get; set; }
    public string? GoogleId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateOnly? DoB { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public DateOnly? CreateDate { get; set; }
    public string? Avatar { get; set; }
    public string? RoleId { get; set; } 
    public bool IsActive { get; set; }
    public bool IsAvailable { get; set; }
}