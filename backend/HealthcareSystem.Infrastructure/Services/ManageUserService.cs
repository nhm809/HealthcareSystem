
using Application.DTOs;
using Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Diagnostics.Eventing.Reader;


namespace Infrastructure.Services
{
    public class ManageUserService : IManageUserService
    {
        private readonly AppDbContext _context;
        
        public ManageUserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountPage()
        {
            int totalUsers = await _context.Users.CountAsync();
            int pageSize = 10; 
            int totalPages = (int)Math.Ceiling((double)totalUsers / pageSize);
            return totalPages;
        }


        public async Task<IEnumerable<ManageUserDTO>> GetUsersPerPageAsync(int page, int pageSize)
        {

            var userList = await _context.Users
                .OrderBy(u => u.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new ManageUserDTO
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    FullName = u.FullName,
                    RoleId = u.RoleId,
                    IsActive = u.IsActive
                })
                .ToListAsync(); 

            return userList;

        }


        public async Task<bool> UpdateUserAsync(ManageUserDTO userDto)
        {
            var user = await _context.Users.FindAsync(userDto.UserId);
            
            if (user == null)
            {
                return false; 
            }

            if(userDto.RoleId != null)
            {
                user.RoleId = userDto.RoleId;
            }

            if(userDto.IsActive != null)
            {
                user.IsActive = userDto.IsActive.Value;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}