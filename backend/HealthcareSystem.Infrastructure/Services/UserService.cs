using System.Threading.Tasks;
using Application.DTOs;
using Infrastructure.data;
using Domain.Entities;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

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
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DoB = user.DoB,
                Gender = user.Gender,
                Address = user.Address,
                CreateDate = user.CreateDate,
                AvatarPath = user.Avatar,
                Role = user.RoleId
            };

        }
    }
}