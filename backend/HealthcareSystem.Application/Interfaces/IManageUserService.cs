
using Application.DTOs;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IManageUserService
    {
        Task<IEnumerable<UserInfoDTO>> GetAllUsersAsync();
        Task<int> CountPage(int pageSize, string? search = null, string? role = null, bool? isAvailable = null);
        Task<IEnumerable<ManageUserDTO>> GetUsersPerPageAsync(int page, int pageSize, string? search, string? roleId, bool? isAvailable);
        Task<bool> UpdateUserAsync(ManageUserDTO userDto);
        Task<bool> DeleteUserAsync(int userId);
        Task<Object> CountUsers();
        Task<IEnumerable<UserInfoDTO>> GetTenLatestUsers();
        Task<bool> SetStatusUser(int userId, bool isAvailable);
        Task<bool> AddSpecialty(ManageSpecialtyDTO dto);
        Task<bool> DeleteSpecialty(ManageSpecialtyDTO dto);
    }
}