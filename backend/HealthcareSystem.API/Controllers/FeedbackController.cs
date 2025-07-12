
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{ 
    [HttpGet]
    [Route("appointment/{appointmentId}")]
    public async Task<ActionResult<IEnumerable<FeedbackDTO>>> GetFeedbackByAppointmentId(int appointmentId, [FromServices] IFeedbackService feedbackService)
    {
        var feedbacks = await feedbackService.GetFeedbackByAppointmentIdAsync(appointmentId);
        if (feedbacks == null || !feedbacks.Any())
        {
            return NotFound("No feedback found for the specified appointment.");
        }
        return Ok(feedbacks);
    }

    [HttpGet]
    [Route("record/{recordId}")]
    public async Task<ActionResult<IEnumerable<FeedbackDTO>>> GetFeedbackByRecordId(int recordId, [FromServices] IFeedbackService feedbackService)
    {
        var feedbacks = await feedbackService.GetFeedbackByRecordIdAsync(recordId);
        if (feedbacks == null || !feedbacks.Any())
        {
            return NotFound("No feedback found for the specified record.");
        }
        return Ok(feedbacks);
    }

    [HttpPost]
    [Route("submit")]
    public async Task<ActionResult<bool>> SubmitFeedback([FromBody] FeedbackDTO feedbackDto, [FromServices] IFeedbackService feedbackService)
    {
        if (feedbackDto == null)
        {
            return BadRequest("Feedback data is required.");
        }
        var result = await feedbackService.SubmitFeedbackAsync(feedbackDto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while submitting feedback.");
        }
        return Ok(true);
    }
    [HttpGet]
    [Route("all")]
    public async Task<ActionResult<IEnumerable<FeedbackDTO>>> GetAllFeedback([FromServices] IFeedbackService feedbackService)
    {
        var feedbacks = await feedbackService.GetAllFeedbackAsync();
        if (feedbacks == null || !feedbacks.Any())
        {
            return NotFound("No feedback found.");
        }
        return Ok(feedbacks);
    }
    // API 1: GET /api/feedback/service-summary
    // Trả về danh sách các dịch vụ kèm số lượng feedback, điểm trung bình
    [HttpGet]
    [Route("service-summary")]
    [ProducesResponseType(typeof(IEnumerable<ServiceSummaryDTO>), 200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> GetServiceSummaries([FromServices] IFeedbackService feedbackService)
    {
        try
        {
            var summaries = await feedbackService.GetServiceSummariesAsync();
            return Ok(summaries);
        }
        catch (Exception ex)
        {
            // TODO: Log the exception appropriately (ví dụ: sử dụng ILogger)
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }

    // API 2: GET /api/feedback/service/{serviceId}
    // Trả về danh sách feedback cho dịch vụ đó, có thể phân trang.
    [HttpGet]
    [Route("service/{serviceId}")]
    [ProducesResponseType(typeof(ServiceFeedbackDetailDTO), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> GetServiceFeedbackDetails(
        int serviceId, // Tham số bắt buộc
        [FromServices] IFeedbackService feedbackService, // Tham số injected (đặt trước các tham số tùy chọn có giá trị mặc định)
        [FromQuery] int pageNumber = 1, // Tham số tùy chọn
        [FromQuery] int pageSize = 10)  // Tham số tùy chọn
    {
        if (pageNumber < 1 || pageSize < 1)
        {
            return BadRequest("Page number and page size must be positive.");
        }

        try
        {
            var details = await feedbackService.GetServiceFeedbackDetailsAsync(serviceId, pageNumber, pageSize);
            if (details == null || !details.Feedbacks.Any())
            {
                return NotFound($"Service with ID {serviceId} not found or has no feedbacks.");
            }
            return Ok(details);
        }
        catch (Exception ex)
        {
            // TODO: Log the exception appropriately (ví dụ: sử dụng ILogger)
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}