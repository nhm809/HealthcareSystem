
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.DTOs;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.Net;


[ApiController]
[Route("api/specialty")]

public class SpecialtyController : ControllerBase
{
    private readonly ISpecialtyService _specialtyService;

    public SpecialtyController(ISpecialtyService specialtyService)
    {
        _specialtyService = specialtyService;
    }

    [HttpGet]
    [Route("getAll")]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            var specialties = await _specialtyService.GetAllAsync();
            return Ok(new { success = true, data = specialties });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
        }
    }

    [HttpGet]
    [Route("getById/{id}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        try
        {
            var specialty = await _specialtyService.GetByIdAsync(id);
            if (specialty == null)
            {
                return NotFound(new { success = false, message = "Specialty not found." });
            }
            return Ok(new { success = true, data = specialty });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
        }
    }

    [HttpGet]
    [Route("getByUserID/{userId}")]
    public async Task<IActionResult> GetByUserIdAsync(int userId)
    {
        try
        {
            var specialties = await _specialtyService.GetByUserIdAsync(userId);
            if (specialties == null || !specialties.Any())
            {
                return NotFound(new { success = false, message = "No specialties found for this user." });
            }
            return Ok(new { success = true, data = specialties });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
        }
    }


    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateAsync([FromBody] SpecialtyDTO specialtyDto)
    {
        if (specialtyDto == null)
        {
            return BadRequest(new { success = false, message = "Invalid specialty data." });
        }

        try
        {
            var createdSpecialty = await _specialtyService.CreateAsync(specialtyDto);

            return Ok(new
            {
                success = true,
                data = createdSpecialty
            });
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { success = false, message = ex.Message }
            );
        }
    }




    [HttpPut]
    [Route("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] SpecialtyDTO specialtyDto)
    {
        if (specialtyDto == null || specialtyDto.Id == null)
        {
            return BadRequest(new { success = false, message = "Invalid specialty data." });
        }
        try
        {
            var updatedSpecialty = await _specialtyService.UpdateAsync(specialtyDto);
            if (updatedSpecialty == null)
            {
                return NotFound(new { success = false, message = "Specialty not found." });
            }
            return Ok(new { success = true, data = updatedSpecialty });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
        }
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        try
        {
            var result = await _specialtyService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { success = false, message = "Specialty not found." });
            }
            return Ok(new { success = true, message = "Specialty deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
        }
    }

}
