
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
}