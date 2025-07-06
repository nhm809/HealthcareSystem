
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


[ApiController]
[Route("api/subQuestion/")]

public class QuestionThreadItemController : ControllerBase
{

    private readonly IQuestionThreadItemService _iQuestionThreadItemService;

    public QuestionThreadItemController(IQuestionThreadItemService questionThreadItemService)
    {
        _iQuestionThreadItemService = questionThreadItemService;
    }

    [HttpGet("getByQuestionId/{questionId}")]
    public async Task<ActionResult<List<QuestionThreadItemDTO>>> GetSubQuestionAsync(int questionId)
    {
        var subQuestions = await _iQuestionThreadItemService.GetSubQuestionAsync(questionId);
        if (subQuestions == null || subQuestions.Count == 0)
        {
            return NotFound("No sub-questions found for this question.");
        }
        return Ok(subQuestions);
    }

    [HttpPost("add")]
    public async Task<ActionResult<bool>> AddSubQuestionAsync([FromBody] QuestionThreadItemDTO dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.QuestionText))
        {
            return BadRequest("Invalid sub-question data.");
        }
        var result = await _iQuestionThreadItemService.AddSubQuestionAsync(dto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while adding the sub-question.");
        }
        return Ok(result);
    }


    [HttpPost("answer")]
    public async Task<ActionResult<bool>> AnswerSubQuestionAsync([FromBody] QuestionThreadItemDTO dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.AnswerText))
        {
            return BadRequest("Invalid answer data.");
        }
        var result = await _iQuestionThreadItemService.AnswerSubQuestionAsync(dto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while answering the sub-question.");
        }
        return Ok(result);
    }

    [HttpPut("update/{subQuestionId}")]
    public async Task<ActionResult<bool>> UpdateSubQuestionAsync(int subQuestionId, [FromBody] QuestionThreadItemDTO dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.QuestionText))
        {
            return BadRequest("Invalid sub-question data.");
        }
        var result = await _iQuestionThreadItemService.UpdateSubQuestionAsync(subQuestionId, dto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while updating the sub-question.");
        }
        return Ok(result);
    }

}
