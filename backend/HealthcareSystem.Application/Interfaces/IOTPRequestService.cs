
using System.Threading.Tasks;
using Application.DTOs;

public interface IOTPRequestService
{
    Task<bool> SendOtpByUserId(int userId);
    Task<bool> SendOtpByEmail(string userEmail);
    Task<bool> VerifyOtp(VerifyOtpDTO dto);
}
