using System;
using System.Threading.Tasks;
using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace HealthcareSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeeklyOverrideScheduleController : ControllerBase
    {
        private readonly IWeeklyOverrideSchedule _service;
        public WeeklyOverrideScheduleController(IWeeklyOverrideSchedule service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<WeeklyOverrideScheduleDTO>> Create([FromBody] CreateWeeklyOverrideScheduleDTO dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(Create), result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<WeeklyOverrideScheduleDTO>>> GetList([FromQuery] int? userId, [FromQuery] string? status, [FromQuery] string? overrideType, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? shiftType)
        {
            var result = await _service.GetListAsync(userId, status, overrideType, fromDate, toDate, shiftType);
            return Ok(result);
        }

        [HttpPut("status")]
        public async Task<ActionResult> UpdateStatus([FromBody] UpdateOverrideStatusDTO dto)
        {
            try
            {
                var result = await _service.UpdateStatusAsync(dto);
                if (result) return Ok(new { message = "Cập nhật trạng thái thành công." });
                return BadRequest(new { message = "Cập nhật trạng thái thất bại." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteAsync(id);
                if (result) return Ok(new { message = "Xóa đăng ký thành công." });
                return BadRequest(new { message = "Xóa đăng ký thất bại." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 