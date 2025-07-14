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
using System.Security.Cryptography;


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

        public async Task<bool> SendOtpByUserId(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return false;

            using var rng = RandomNumberGenerator.Create();
            byte[] data = new byte[4];
            rng.GetBytes(data);
            int raw = Math.Abs(BitConverter.ToInt32(data, 0));
            int code = raw % 900000 + 100000;
            var otpCode = Math.Abs(code).ToString();

            var otpEntity = new OtpRequest
            {
                UserId = userId,
                Code = otpCode,
                Email = user.Email,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                ExpiredAt = DateTime.UtcNow.AddHours(7).AddMinutes(3),
                IsVerified = 0
            };

            _context.OtpRequests.Add(otpEntity);
            await _context.SaveChangesAsync();

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(user.Email));
            email.Subject = "Xác thực OTP - Đổi mật khẩu / email";
            email.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; background-color: #f2f6f9; padding: 30px 0;'>
                        <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;'>

                            <!-- Logo -->
                            <div style='text-align: center; margin-bottom: 24px;'>
                                <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                                     alt='Healthcare System Logo'
                                     style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                            </div>


                            <!-- Nội dung chính -->
                            <h2 style='color: #1a73e8; text-align: center; margin-bottom: 20px;'>Xác thực OTP</h2>

                            <p style='font-size: 15px; color: #333; line-height: 1.6; text-align: center;'>
                                Bạn đã yêu cầu một mã OTP để thực hiện xác thực trên hệ thống <strong>Healthcare System</strong>.
                                Vui lòng sử dụng mã bên dưới để hoàn tất thao tác.
                            </p>

                            <!-- Mã OTP -->
                            <div style='text-align: center; margin: 30px 0;'>
                                <span style='font-size: 32px; font-weight: bold; color: #1a73e8; padding: 16px 32px; background-color: #f4faff; border: 2px dashed #1a73e8; border-radius: 8px;'>{otpCode}</span>
                                <p style='margin-top: 12px; font-size: 14px; color: #555;'>Mã sẽ hết hạn sau <strong>3 phút</strong>.</p>
                            </div>

                            <p style='font-size: 14px; color: #555; text-align: center;'>
                                Vui lòng <strong>không chia sẻ</strong> mã này với bất kỳ ai. Nếu bạn không yêu cầu mã OTP này, hãy bỏ qua email này.
                            </p>

                            <hr style='margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;' />

                            <p style='font-size: 12px; color: #999; text-align: center;'>
                                Email được gửi tự động từ hệ thống <strong>Healthcare System</strong>. Vui lòng không phản hồi lại email này.
                            </p>
                        </div>
                    </div>
                "
            };



            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return true;

        }

        public async Task<bool> SendOtpByEmail(string userEmail)
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] data = new byte[4];
            rng.GetBytes(data);
            int code = BitConverter.ToInt32(data, 0) % 900000 + 100000;
            var otpCode = Math.Abs(code).ToString();

            var otpEntity = new OtpRequest
            {
                Code = otpCode,
                Email = userEmail,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                ExpiredAt = DateTime.UtcNow.AddHours(7).AddMinutes(3),
                IsVerified = 0
            };

            _context.OtpRequests.Add(otpEntity);
            await _context.SaveChangesAsync();

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Gender Healthcare System", _config["EmailSettings:From"]));
            email.To.Add(MailboxAddress.Parse(userEmail));
            email.Subject = "Xác thực OTP - Đổi mật khẩu / email";
            email.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; background-color: #f2f6f9; padding: 30px 0;'>
                        <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;'>

                            <!-- Logo -->
                            <div style='text-align: center; margin-bottom: 24px;'>
                                <img src='https://drive.google.com/uc?export=view&id=1fAWDOkaMgta-jhbFkghgoFN19Sgr4QBA'
                                     alt='Healthcare System Logo'
                                     style='max-width: 100%; height: auto; width: 100%; object-fit: contain; border-radius: 6px;' />
                            </div>


                            <!-- Nội dung chính -->
                            <h2 style='color: #1a73e8; text-align: center; margin-bottom: 20px;'>Xác thực OTP</h2>

                            <p style='font-size: 15px; color: #333; line-height: 1.6; text-align: center;'>
                                Bạn đã yêu cầu một mã OTP để thực hiện xác thực trên hệ thống <strong>Healthcare System</strong>.
                                Vui lòng sử dụng mã bên dưới để hoàn tất thao tác.
                            </p>

                            <!-- Mã OTP -->
                            <div style='text-align: center; margin: 30px 0;'>
                                <span style='font-size: 32px; font-weight: bold; color: #1a73e8; padding: 16px 32px; background-color: #f4faff; border: 2px dashed #1a73e8; border-radius: 8px;'>{otpCode}</span>
                                <p style='margin-top: 12px; font-size: 14px; color: #555;'>Mã sẽ hết hạn sau <strong>3 phút</strong>.</p>
                            </div>

                            <p style='font-size: 14px; color: #555; text-align: center;'>
                                Vui lòng <strong>không chia sẻ</strong> mã này với bất kỳ ai. Nếu bạn không yêu cầu mã OTP này, hãy bỏ qua email này.
                            </p>

                            <hr style='margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;' />

                            <p style='font-size: 12px; color: #999; text-align: center;'>
                                Email được gửi tự động từ hệ thống <strong>Healthcare System</strong>. Vui lòng không phản hồi lại email này.
                            </p>
                        </div>
                    </div>
                "
            };



            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return true;
        }


        public async Task<bool> VerifyOtp(VerifyOtpDTO dto)
        {
            if (dto == null || (dto.UserId == null && string.IsNullOrWhiteSpace(dto.Email)))
                return false;

            OtpRequest otpRequest = null;
            User user = null;

            if (dto.UserId != null)
            {
                otpRequest = await _context.OtpRequests
                                           .FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.Code == dto.Code && o.IsVerified == 0);

                user = await _context.Users.FindAsync(dto.UserId);
            }
            else if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                otpRequest = await _context.OtpRequests
                                           .FirstOrDefaultAsync(o => o.Email == dto.Email && o.Code == dto.Code && o.IsVerified == 0);

                user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Email == dto.Email);
            }

            if (otpRequest == null || otpRequest.ExpiredAt < DateTime.UtcNow.AddHours(7) || user == null)
            {
                return false;
            }

            otpRequest.IsVerified = 1;
            user.IsAvailable = true;

            await _context.SaveChangesAsync();

            return true;
        }

    }
}