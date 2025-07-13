using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;            
using Infrastructure.data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<int> RegisterAsync(RegisterDTO dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                if (existingUser.IsAvailable)
                {
                    throw new Exception("Email already exists.");
                }
                else
                {
                    existingUser.PhoneNumber = dto.PhoneNumber;
                    existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                    existingUser.CreateDate = DateOnly.FromDateTime(DateTime.Now.AddHours(7));
                    existingUser.Provider = "Local";
                    existingUser.RoleId = "MB";
                    existingUser.IsAvailable = false;

                    try
                    {
                        _context.Users.Update(existingUser);
                        await _context.SaveChangesAsync();

                        return existingUser.UserId;
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Database error: " + (ex.InnerException?.Message ?? ex.Message));
                    }
                }
            }

            if (await _context.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber))
            {
                throw new Exception("Phone number already exists.");
            }

            var user = new User
            {
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Provider = "Local",
                RoleId = "MB",
                IsAvailable = false,
                CreateDate = DateOnly.FromDateTime(DateTime.Now.AddHours(7))
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return user.UserId;
            }
            catch (Exception ex)
            {
                throw new Exception("Database error: " + (ex.InnerException?.Message ?? ex.Message));
            }
        }



        public async Task<LoginResponseDTO> LoginAsync(LoginDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password.");
            }

            if (!user.IsAvailable)
            {
                throw new Exception("User is not available.");
            }

            var RefreshToken = user.RefreshToken;
            if (string.IsNullOrEmpty(RefreshToken) || user.RefreshTokenExpiryTime < DateTime.Now.AddHours(7))
            {
                RefreshToken = GenerateRefreshToken();
                user.RefreshToken = RefreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddHours(7).AddDays(15);
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            var expiresAcessToken = DateTime.Now.AddHours(7).AddHours(1);
            var token = GenerateJwtToken(user, expiresAcessToken);

            return new LoginResponseDTO
            {
                Token = token,
                RefreshToken = RefreshToken,
                UserId = user.UserId,
                Email = user.Email,
                FullName = user.FullName ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                Role = user.RoleId,
                AvatarPath = user.Avatar ?? string.Empty,
                ExpiresAcessToken = expiresAcessToken,
                ExpiresRefreshToken = user.RefreshTokenExpiryTime
            };

        }

        private string GenerateJwtToken(User user, DateTime expires)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Secret"]);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.RoleId.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var ramdomNumber = new byte[64];
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                rng.GetBytes(ramdomNumber);
                return Convert.ToBase64String(ramdomNumber);
            }
        }
    }
}