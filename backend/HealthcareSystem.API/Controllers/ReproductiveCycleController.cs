
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Entities;

[ApiController]
[Route("api/cycle")]
public class ReproductiveCycleController : ControllerBase
{
    private readonly IReproductiveCycleService _reproductiveCycleService;
    public ReproductiveCycleController(IReproductiveCycleService reproductiveCycleService)
    {
        _reproductiveCycleService = reproductiveCycleService;
    }
    [HttpGet("{memberId}")]
    public async Task<IActionResult> GetReproductiveCycles(int memberId)
    {
        if (memberId <= 0)
        {
            return BadRequest("Invalid member ID.");
        }
        var cycles = await _reproductiveCycleService.GetReproductiveCycleAsync(memberId);
        if (cycles == null || !cycles.Any())
        {
            return NotFound("No reproductive cycles found for the specified member.");
        }
        return Ok(cycles);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddReproductiveCycleInfo([FromBody] ReproductiveCycleDTO cycleDto)
    {
        if (cycleDto == null || cycleDto.MemberId <= 0)
        {
            return BadRequest("Invalid reproductive cycle data.");
        }
        var addedCycle = await _reproductiveCycleService.AddReproductiveCycleInfoAsync(cycleDto);
        if (addedCycle == null)
        {
            return BadRequest("Failed to add reproductive cycle information.");
        }
        return CreatedAtAction(nameof(GetReproductiveCycles), new { memberId = addedCycle.MemberId }, addedCycle);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateReproductiveCycle([FromBody] ReproductiveCycleDTO cycleDto)
    {
        if (cycleDto == null || cycleDto.CycleId <= 0)
        {
            return BadRequest("Invalid reproductive cycle data.");
        }
        var updatedCycle = await _reproductiveCycleService.UpdateReproductiveCycleAsync(cycleDto);
        if (updatedCycle == null)
        {
            return NotFound("Reproductive cycle not found.");
        }
        return Ok(updatedCycle);
    }

    [HttpDelete("delete/{cycleId}")]
    public async Task<IActionResult> DeleteReproductiveCycle(int cycleId)
    {
        if (cycleId <= 0)
        {
            return BadRequest("Invalid cycle ID.");
        }
        var isDeleted = await _reproductiveCycleService.DeleteReproductiveCycleAsync(cycleId);
        if (!isDeleted)
        {
            return NotFound("Reproductive cycle not found.");
        }
        return Ok(isDeleted);
    }
}