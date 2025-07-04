
using Application.DTOs;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IManageUserService
    {
        Task<IEnumerable<UserInfoDTO>> GetAllUsersAsync();
        Task<int> CountPage();
        Task<IEnumerable<ManageUserDTO>> GetUsersPerPageAsync(int page, int pageSize);
        Task<bool> UpdateUserAsync(ManageUserDTO userDto);
        Task<bool> DeleteUserAsync(int userId);
        Task<string> CountUsers();
        Task<IEnumerable<UserInfoDTO>> GetTenLatestMembers();

    }
}