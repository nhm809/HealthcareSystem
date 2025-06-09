using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using Application.DTOs;
using Google.Apis.Auth;
using Infrastructure.data;
using Domain.Entities;  
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Infrastructure.Services
{
    public class GoogleLoginService : IGoogleLoginService
    {
        private readonly IConfiguration _config; //Sử dụng IConfiguration để lấy thông tin cấu hình từ appsettings.json
        private readonly AppDbContext _context;
        private readonly ILogger<GoogleLoginService> _logger; // Thêm ILogger để ghi log lỗi


        public GoogleLoginService(IConfiguration config, AppDbContext context, ILogger<GoogleLoginService> logger)
        {
            _config = config;
            _context = context;
            _logger = logger;
        }


        public async Task<GoogleLoginDTO> ValidateGoogleTokenAsync(GoogleTokenRequestDTO request)
        {
            try {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Authentication:Google:ClientId"] } // Lấy ClientId từ appsettings.json
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

                var Sub = payload.Subject; 

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.GoogleId == Sub);
                if (user == null)
                {
                    user = new User
                    {
                        GoogleId = Sub,
                        Provider = "Google",
                        FullName = payload.Name,
                        Avatar = payload.Picture,
                        Email = payload.Email,
                        CreateDate = DateOnly.FromDateTime(DateTime.UtcNow),
                        RoleId = "MB"
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var userId = user.UserId;

                return new GoogleLoginDTO
                {
                    UserId = userId,
                    Sub = Sub,
                    FullName = user.FullName,
                    Picture = user.Avatar,
                    Email = user.Email,
                    Email_verified = payload.EmailVerified,
                    Locale = payload.Locale
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating Google token.");
                return null;
            }

        }
    }
}