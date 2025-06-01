using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{

    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterDTO dto);
        Task<LoginResponseDTO> LoginAsync(LoginDTO dto);
    }
}