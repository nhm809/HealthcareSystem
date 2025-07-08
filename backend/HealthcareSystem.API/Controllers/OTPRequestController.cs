using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/otp")]
public class OTPRequestController : ControllerBase
{
    private readonly IOTPRequestService _otpService;

    public OTPRequestController(IOTPRequestService otpService)
    {
        _otpService = otpService;
    }

    [HttpPost("sendOtpByUserId/{userId}")]
    public async Task<IActionResult> GetOtpAsync(int userId)
    {
        if (userId == null)
        {
            return BadRequest("Phải cung cấp UserId.");
        }

        var result = await _otpService.SendOtpByUserId(userId);

        if (!result)
        {
            return StatusCode(500, "Gửi OTP thất bại.");
        }

        return Ok("OTP đã được gửi đến email.");
    }

    [HttpPost("sendOtpByEmail")]
    public async Task<IActionResult> GetOtpByEmailAsync([FromBody] string userEmail)
    {
        if (string.IsNullOrEmpty(userEmail))
        {
            return BadRequest("Phải cung cấp Email.");
        }
        var result = await _otpService.SendOtpByEmail(userEmail);
        if (!result)
        {
            return StatusCode(500, "Gửi OTP thất bại.");
        }
        return Ok("OTP đã được gửi đến email.");
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtpAsync([FromBody] VerifyOtpDTO dto)
    {
        if ((dto.UserId <= 0 && string.IsNullOrWhiteSpace(dto.Email)) || string.IsNullOrEmpty(dto.Code))
        {
            return BadRequest("Thiếu UserId/Email hoặc mã OTP.");
        }

        var result = await _otpService.VerifyOtp(dto);

        if (!result)
            return BadRequest("Mã OTP không đúng hoặc đã hết hạn.");

        return Ok("OTP xác thực thành công.");
    }

}
