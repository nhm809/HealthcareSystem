using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.DTOs; // Make sure this using directive is present!
using System.Threading.Tasks;

namespace HealthcareSystem.API.Controllers
{
    [Route("api/[controller]")] // This means: api/Dashboard
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // Endpoint for Dashboard Data
        [HttpGet("data")] // This means: GET api/Dashboard/data
        public async Task<IActionResult> GetDashboardData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _dashboardService.GetDashboardData(startDate, endDate);
            return Ok(result);
        }

        // Endpoint for Total Revenue
        [HttpPost("revenue")] // This means: POST api/Dashboard/revenue
        public async Task<IActionResult> GetTotalRevenue([FromBody] DateRangeRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Request body is null.");
            }
            try
            {
                var result = await _dashboardService.GetTotalRevenueAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // Endpoint mới để so sánh doanh thu
        [HttpPost("revenue-comparison")] // Endpoint mới: POST api/Dashboard/revenue-comparison
        public async Task<IActionResult> GetRevenueComparison([FromBody] DashboardComparisonRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Request body is null.");
            }
            try
            {
                var result = await _dashboardService.GetRevenueComparisonAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}