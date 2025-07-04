using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using Infrastructure.data;
using Domain.Entities;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<UserInfoDTO> GetUserInfo(string userId)
        {
            var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            return new UserInfoDTO
            {
                UserId = user.UserId,
                Provider = user.Provider,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DoB = user.DoB,
                Gender = user.Gender,
                Address = user.Address,
                CreateDate = user.CreateDate,
                Avatar = user.Avatar,
                RoleId = user.RoleId,
                IsAvailable = user.IsAvailable
            };

        }

        public async Task<bool> UpdateUserInfo(int userId, UserDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return false; // User not found
            }

            if (dto.FullName != null)
            {
                user.FullName = dto.FullName;
            }
            if (dto.Email != null)
            {
                user.Email = dto.Email;
            }
            if (dto.PhoneNumber != null)
            {
                user.PhoneNumber = dto.PhoneNumber;
            }
            if (dto.DoB != null)
            {
                user.DoB = dto.DoB;
            }
            if (dto.Gender != null)
            {
                user.Gender = dto.Gender;
            }
            if (dto.Address != null)
            {
                user.Address = dto.Address;
            }
            if (dto.Avatar != null)
            {
                user.Avatar = dto.Avatar;
            }

            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool> ChangePassword(int userId, ChangePasswordRequestDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                return false; // User not found or old password does not match
            }
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}