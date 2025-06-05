using Application.DTOs;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IGoogleLoginService
    {
        Task<GoogleLoginDTO> ValidateGoogleTokenAsync(GoogleTokenRequestDTO request);
    }
}