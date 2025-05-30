using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{

    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterDTO dto);
        Task<bool> LoginAsync(LoginDTO dto);
        Task<string> GetRoleAsync(LoginDTO dto);
    }
}