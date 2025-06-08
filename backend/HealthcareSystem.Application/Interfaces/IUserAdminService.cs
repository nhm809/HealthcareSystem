using Application.DTOs;

public interface IUserAdminService
{
    Task<List<UserRoleDTO>> GetAllUsersAsync();
    Task<bool> UpdateUserRoleAsync(UpdateUserRoleDTO dto);
}
