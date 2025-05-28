using System.Threading.Tasks;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDTO dto);
    Task<bool> LoginAsync(LoginDTO dto);
}