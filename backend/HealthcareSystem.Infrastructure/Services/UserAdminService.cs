using Application.DTOs;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;

public class UserAdminService : IUserAdminService
{
    private readonly AppDbContext _context;

    public UserAdminService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserRoleDTO>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .Select(u => new UserRoleDTO
            {
                UserID = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                RoleID = u.RoleId,
                RoleName = u.Role.RoleName
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateUserRoleAsync(UpdateUserRoleDTO dto)
    {
        var user = await _context.Users.FindAsync(dto.UserID);
        if (user == null) return false;

        user.RoleId = dto.RoleID;
        await _context.SaveChangesAsync();
        return true;
    }
}
