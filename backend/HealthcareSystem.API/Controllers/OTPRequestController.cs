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

    [HttpPost("sendOtp/{userId}")]
    public async Task<IActionResult> GetOtpAsync(int userId)
    {
        if (userId == null)
        {
            return BadRequest("Phải cung cấp ít nhất Email hoặc UserId.");
        }

        var result = await _otpService.SendOtpAsync(userId);

        if (!result)
        {
            return StatusCode(500, "Gửi OTP thất bại.");
        }

        return Ok("OTP đã được gửi đến email.");
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtpAsync([FromBody] VerifyOtpDTO dto)
    {
        if (dto.UserId <= 0 || string.IsNullOrEmpty(dto.Code))
            return BadRequest("Thiếu UserId hoặc mã OTP.");

        var result = await _otpService.VerifyOtpAsync(dto);

        if (!result)
            return BadRequest("Mã OTP không đúng hoặc đã hết hạn.");

        return Ok("OTP xác thực thành công.");
    }

}
