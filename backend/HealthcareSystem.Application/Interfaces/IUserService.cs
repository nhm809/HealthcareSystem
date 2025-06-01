
using Application.DTOs;

namespace Application.Interfaces{
    public interface IUserService
    {
        Task<UserInfoDTO> GetUserInfo(string userId);
    }
}