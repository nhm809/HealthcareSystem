
using System.Threading.Tasks;
using Application.DTOs;

public interface IOTPRequestService
{
    Task<bool> SendOtpAsync(int userId);
    Task<bool> VerifyOtpAsync(VerifyOtpDTO dto);
}
