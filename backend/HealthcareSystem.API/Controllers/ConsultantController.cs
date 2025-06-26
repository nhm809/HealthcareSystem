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
        [HttpGet("{id}/available-slots")]
        public async Task<IActionResult> GetFreeSlotsByDate(int id, [FromQuery] DateTime date)
        {
            var result = await _consultantService.GetAvailableTimeSlotsByDateAsync(id, date);

            var startTimesOnly = result
                .Select(s => $"{s.Start:HH\\:mm}") // chỉ lấy giờ bắt đầu
                .Distinct()
                .ToList();

            return Ok(new
            {
                success = true,
                data = startTimesOnly
            });
        }

    }
}