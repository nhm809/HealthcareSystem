
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

[ApiController]
[Route("api/manageUser")]
public class ManageUserController : ControllerBase
{
    private readonly IManageUserService _manageUserService;

    public ManageUserController(IManageUserService manageUserService)
    {
        _manageUserService = manageUserService;
    }


    [HttpGet]
    [Route("getAllUsers")]
    public async Task<IActionResult> GetAllUsersAsync()
    {
        try
        {
            var users = await _manageUserService.GetAllUsersAsync();
            return Ok(new
            {
                Success = true,
                Data = users
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "Đã xảy ra lỗi khi lấy danh sách người dùng.",
                Details = ex.Message
            });
        }
    }


    [HttpGet]
    [Route("countPage")]
    public async Task<IActionResult> GetCountPageAsync()
    {
        try
        {
            var count = await _manageUserService.CountPage();
            return Ok(new { success = true, count });
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpGet]
    [Route("loadUserPerPage/{page}/{pageSize}")]
    public async Task<IActionResult> GetUsersPerPageAsync(int page, int pageSize)
    {
        try
        {
            var users = await _manageUserService.GetUsersPerPageAsync(page, pageSize);
            return Ok(new { success = true, users });
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpPut]
    [Route("updateUser")]
    public async Task<IActionResult> UpdateUserAsync([FromBody] ManageUserDTO userDto)
    {
        try
        {
            if (userDto == null || userDto.UserId == null)
            {
                return BadRequest(new { success = false, message = "Invalid user data." });
            }
            var result = await _manageUserService.UpdateUserAsync(userDto);
            if (result)
            {
                return Ok(new { success = true, message = "User updated successfully." });
            }
            else
            {
                return NotFound(new { success = false, message = "User not found." });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpDelete]
    [Route("deleteUser/{userId}")]
    public async Task<IActionResult> DeleteUserAsync(int userId)
    {
        try
        {
            var result = await _manageUserService.DeleteUserAsync(userId);
            if (result)
            {
                return Ok(new { success = true, message = "User deleted successfully." });
            }
            else
            {
                return NotFound(new { success = false, message = "User not found." });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpGet]
    [Route("countUsers")]
    public async Task<IActionResult> CountUsersAsync()
    {
        try
        {
            var res = await _manageUserService.CountUsers();
            return Content(res, "text/plain");
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpGet]
    [Route("getTenLatestMembers")]
    public async Task<IActionResult> GetTenLatestMembersAsync()
    {
        try
        {
            var members = await _manageUserService.GetTenLatestMembers();
            return Ok(new { success = true, members });
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpPut]
    [Route("setStatusUser/{userId}/{isAvailable}")]
    public async Task<IActionResult> SetStatusUserAsync(int userId, bool isAvailable)
    {
        try
        {
            var result = await _manageUserService.SetStatusUser(userId, isAvailable);
            if (result)
            {
                return Ok(new { success = true, message = "User status updated successfully." });
            }
            else
            {
                return NotFound(new { success = false, message = "User not found." });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

}