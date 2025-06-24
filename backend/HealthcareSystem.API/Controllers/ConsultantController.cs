using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/consultants")]
    public class ConsultantController : ControllerBase
    {
        private readonly IConsultantService _consultantService;

        public ConsultantController(IConsultantService consultantService)
        {
            _consultantService = consultantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllConsultants()
        {
            var result = await _consultantService.GetAllConsultantsWithSpecialtiesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetConsultantDetail(int id)
        {
            var result = await _consultantService.GetConsultantDetailAsync(id);
            if (result == null)
                return NotFound(new { message = "Consultant không tồn tại." });

            return Ok(result);
        }
    }
}