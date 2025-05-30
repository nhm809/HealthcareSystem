using HealthcareSystem.Application.DTOs;

namespace HealthcareSystem.Application.Interfaces
{
    public interface IHomeService
    {
        Task<HomeGuestDTO> GetGuestHomeData();
        Task<HomeMemberDTO> GetMemberHomeData(int userId);

    }
}
