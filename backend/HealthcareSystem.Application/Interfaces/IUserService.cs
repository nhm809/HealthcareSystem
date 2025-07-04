
using Application.DTOs;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<UserInfoDTO> GetUserInfo(string userId);
        Task<bool> UpdateUserInfo(int userId, UserDTO dto);
        Task<bool> ChangePassword(int userId, ChangePasswordRequestDTO dto);
    }
}