
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


        public async Task<IEnumerable<UserInfoDTO>> GetAllUsersAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId != "AD" && u.RoleId != "MG")
                .Select(u => new UserInfoDTO
                {
                    UserId = u.UserId,
                    Provider = u.Provider,
                    GoogleId = u.GoogleId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    DoB = u.DoB,
                    Gender = u.Gender,
                    Address = u.Address,
                    CreateDate = u.CreateDate,
                    Avatar = u.Avatar,
                    RoleId = u.RoleId,
                    IsAvailable = u.IsAvailable
                })
                .ToListAsync();
        }


        public async Task<int> CountPage(int pageSize, string? search = null, string? role = null, bool? isAvailable = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(role))
            {
                query = query.Where(u => u.RoleId == role);
            }

            if (isAvailable.HasValue)
            {
                query = query.Where(u => u.IsAvailable == isAvailable.Value);
            }

            int totalUsers = await query.CountAsync();
            int totalPages = (int)Math.Ceiling((double)totalUsers / pageSize);
            return totalPages;
        }


        public async Task<IEnumerable<ManageUserDTO>> GetUsersPerPageAsync(int page, int pageSize, string? search, string? roleId, bool? isAvailable)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.FullName.Contains(search) || u.Email.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(roleId))
            {
                query = query.Where(u => u.RoleId == roleId);
            }

            if (isAvailable.HasValue)
            {
                query = query.Where(u => u.IsAvailable == isAvailable.Value);
            }

            var userList = await query
                .OrderBy(u => u.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new ManageUserDTO
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    FullName = u.FullName,
                    RoleId = u.RoleId,
                    PhoneNumber = u.PhoneNumber,
                    CreateDate = u.CreateDate,
                    IsAvailable = u.IsAvailable
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

            if (userDto.RoleId != null)
            {
                user.RoleId = userDto.RoleId;
            }

            if (userDto.IsAvailable != null)
            {
                user.IsAvailable = userDto.IsAvailable.Value;
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

        public async Task<Object> CountUsers()
        {
            int totalUsers = await _context.Users.CountAsync();
            int admins = await _context.Users.CountAsync(u => u.RoleId.Equals("AD"));
            int members = await _context.Users.CountAsync(u => u.RoleId.Equals("MB"));
            int staffs = await _context.Users.CountAsync(u => u.RoleId.Equals("ST"));
            int consultants = await _context.Users.CountAsync(u => u.RoleId.Equals("CS"));
            int managers = await _context.Users.CountAsync(u => u.RoleId.Equals("MG"));

            return new
            {
                totalUsers,
                admins,
                managers,
                staffs,
                consultants,
                members
            };
        }

        public async Task<IEnumerable<UserInfoDTO>> GetTenLatestUsers()
        {
            return await _context.Users
                .Select(u => new UserInfoDTO
                {
                    UserId = u.UserId,
                    Provider = u.Provider,
                    GoogleId = u.GoogleId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    DoB = u.DoB,
                    Gender = u.Gender,
                    Address = u.Address,
                    CreateDate = u.CreateDate,
                    Avatar = u.Avatar,
                    RoleId = u.RoleId,
                    IsAvailable = u.IsAvailable
                })
                .Where(u => u.IsAvailable)
                .OrderByDescending(u => u.CreateDate)
                .Take(10)
                .ToListAsync();
        }

        public async Task<bool> SetStatusUser(int userId, bool isAvailable)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            user.IsAvailable = isAvailable;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> AddSpecialty(ManageSpecialtyDTO dto)
        {
            var user = await _context.Users
                                     .Include(u => u.Specialties)
                                     .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

            var specialty = await _context.Specialties.FindAsync(dto.SpecialtyId);

            if (user == null || specialty == null)
            {
                return false;
            }

            if (!user.Specialties.Any(s => s.SpecialtyId == dto.SpecialtyId))
            {
                user.Specialties.Add(specialty);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> DeleteSpecialty(ManageSpecialtyDTO dto)
        {
            var user = await _context.Users
                                     .Include(u => u.Specialties)
                                     .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

            var specialty = await _context.Specialties.FindAsync(dto.SpecialtyId);

            if (user == null || specialty == null)
            {
                return false;
            }

            if (user.Specialties.Any(s => s.SpecialtyId == dto.SpecialtyId))
            {
                user.Specialties.Remove(specialty);
                await _context.SaveChangesAsync();
            }

            return true;
        }
    }
}