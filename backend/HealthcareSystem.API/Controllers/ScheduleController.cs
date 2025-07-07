using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HealthcareSystem.Application.Interfaces;
using System;
using System.Collections.Generic;
using HealthcareSystem.Application.DTOs;

[ApiController]
[Route("api/schedule")]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleService _scheduleService;
    public ScheduleController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpGet("week/{userId}")]
    public async Task<ActionResult<IEnumerable<DayScheduleDTO>>> GetUserWeekSchedule(int userId, [FromQuery] int offset = 0)
    {
        var result = await _scheduleService.GetUserWeekScheduleAsync(userId, offset);
        return Ok(result);
    }
} 