using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{

    public interface IAuthService
    {
        Task<int> RegisterAsync(RegisterDTO dto);
        Task<LoginResponseDTO> LoginAsync(LoginDTO dto);
    }
}