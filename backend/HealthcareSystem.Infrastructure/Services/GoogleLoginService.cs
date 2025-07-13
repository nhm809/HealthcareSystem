using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using Application.DTOs;
using Google.Apis.Auth;
using Infrastructure.data;
using Domain.Entities;  
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;



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

                // Generate JWT token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim(ClaimTypes.NameIdentifier, Sub),
                new Claim(ClaimTypes.Email, payload.Email),
                new Claim(ClaimTypes.Name, payload.Name)
            }),
                     SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var refreshToken = Guid.NewGuid().ToString();



                if (user == null)
                {
                    user = new User
                    {
                        GoogleId = Sub,
                        Provider = "Google",
                        FullName = payload.Name,
                        Avatar = payload.Picture,
                        Email = payload.Email,
                        CreateDate = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7)),
                        RoleId = "MB",
                        RefreshToken = refreshToken,
                        RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(7).AddDays(7)

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
                    Locale = payload.Locale,
                    Token = tokenHandler.WriteToken(token),
                    RefreshToken = user.RefreshToken,
                    ExpiresAcessToken = DateTime.UtcNow.AddHours(7).AddHours(1),
                    ExpiresRefreshToken = user.RefreshTokenExpiryTime
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