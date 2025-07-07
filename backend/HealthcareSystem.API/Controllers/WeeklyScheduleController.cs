using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeeklyScheduleController : ControllerBase
    {
        private readonly IWeeklyScheduleService _weeklyScheduleService;

        public WeeklyScheduleController(IWeeklyScheduleService weeklyScheduleService)
        {
            _weeklyScheduleService = weeklyScheduleService;
        }

        [HttpPost]
        public async Task<ActionResult<WeeklyScheduleDTO>> CreateWeeklySchedule([FromBody] CreateWeeklyScheduleDTO createDto)
        {
            try
            {
                var result = await _weeklyScheduleService.CreateWeeklyScheduleAsync(createDto);
                return CreatedAtAction(nameof(CreateWeeklySchedule), result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Xảy ra lỗi khi tạo mới lịch làm việc: {ex.Message}" });
            }
        }

        [HttpDelete("{weeklyScheduleId}")]
        public async Task<ActionResult> DeleteWeeklySchedule(int weeklyScheduleId)
        {
            var result = await _weeklyScheduleService.DeleteWeeklyScheduleAsync(weeklyScheduleId);
            if(result)
            {
                return NoContent();
            }
            else
            {
                return NotFound(new { message = "Xóa thất bại" });
            }
        }

        [HttpPut("{weeklyScheduleId}")]
        public async Task<ActionResult<WeeklyScheduleDTO>> UpdateWeeklySchedule(int weeklyScheduleId, [FromBody] UpdateWeeklyScheduleDTO updateDto)
        {
            try
            {
                var result = await _weeklyScheduleService.UpdateWeeklyScheduleAsync(weeklyScheduleId, updateDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Xảy ra lỗi khi cập nhật lịch làm việc: {ex.Message}" });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<WeeklyScheduleDTO>>> GetWeeklySchedulesByUserId(int userId)
        {
            try
            {
                var result = await _weeklyScheduleService.GetWeeklySchedulesByUserIdAsync(userId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Xảy ra lỗi khi lấy danh sách lịch làm việc: {ex.Message}" });
            }
        }

        [HttpGet("{weeklyScheduleId}")]
        public async Task<ActionResult<WeeklyScheduleDTO>> GetWeeklyScheduleById(int weeklyScheduleId)
        {
            try
            {
                var result = await _weeklyScheduleService.GetWeeklyScheduleByIdAsync(weeklyScheduleId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Xảy ra lỗi khi lấy thông tin lịch làm việc: {ex.Message}" });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<WeeklyScheduleDTO>>> SearchWeeklySchedules(
            [FromQuery] int? userId = null,
            [FromQuery] int? dayOfWeek = null,
            [FromQuery] int? shiftType = null)
        {
            try
            {
                var result = await _weeklyScheduleService.SearchWeeklySchedulesAsync(userId, dayOfWeek, shiftType);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Xảy ra lỗi khi tìm kiếm lịch làm việc: {ex.Message}" });
            }
        }
    }
} 