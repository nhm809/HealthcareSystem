using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using System;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;
using Domain.Entities;


namespace Infrastructure.Services
{
    public class OTPRequestService : IOTPRequestService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public OTPRequestService(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        public async Task<bool> SendOtpAsync(OTPRequestDTO dto)
        {
            var otpCode = new Random().Next(100000, 999999).ToString();
            var otpEntity = new OtpRequest
            {
                UserId = dto.UserId,
                Code = otpCode,
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow,
                ExpiredAt = DateTime.UtcNow.AddMinutes(1),
                IsVerified = 0
            };

            _context.OtpRequests.Add(otpEntity);
            await _context.SaveChangesAsync();

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(dto.Email));
            email.Subject = "Xác thực OTP - Đổi mật khẩu / email";
            email.Body = new TextPart("plain")
            {
                Text = $"Mã OTP của bạn là: {otpCode}. Mã sẽ hết hạn sau 1 phút."
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return true;

        }

        public async Task<bool> VerifyOtpAsync(VerifyOtpDTO dto)
        {
            var otpRequest = await _context.OtpRequests
                .FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.Code == dto.Code && o.IsVerified == 0);

            if (otpRequest == null || otpRequest.ExpiredAt < DateTime.UtcNow)
            {
                return false;
            }

            otpRequest.IsVerified = 1;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}