
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/Noti/")]

public class NotiControllter: ControllerBase
{
    private readonly INotiService _notiService;

    public NotiControllter(INotiService notiService)
    {
        _notiService = notiService;
    }


    [HttpGet("getNoti/{userId}")]
    public async Task<IActionResult> GetAllNoti(int userId)
    {
        try
        {
            var notifications = await _notiService.GetAllNotiAsync(userId);
            return Ok(notifications);
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

    [HttpPost("createNoti")]
    public async Task<IActionResult> CreateNoti([FromBody] CreateNotiDTO createNotiDTO)
    {
        bool isCreated = await _notiService.CreateNotiAsync(createNotiDTO);
        if(isCreated)
        {
            
            return Ok(new { success = true, message = "Notification created successfully" });
        }
        else
        {
            return BadRequest(new { success = false, message = "Notification created fail" });
        }
    }

    [HttpPut("markAsRead/{notiId}")]
    public async Task<IActionResult> MarkAsRead(int notiId)
    {
        try
        {
            int result = await _notiService.MarkAsReadAsync(notiId);
            if (result > 0)
            {
                return Ok(new { success = true, message = "Notification marked as read" });
            }
            else
            {
                return NotFound(new { success = false, message = "Notification not found" });
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { success = false, message = e.Message });
        }
    }

}