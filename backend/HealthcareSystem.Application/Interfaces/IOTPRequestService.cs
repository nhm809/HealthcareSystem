
using System.Threading.Tasks;
using Application.DTOs;

public interface IOTPRequestService
{
    Task<bool> SendOtpAsync(OTPRequestDTO dto);
    Task<bool> VerifyOtpAsync(VerifyOtpDTO dto);
}
