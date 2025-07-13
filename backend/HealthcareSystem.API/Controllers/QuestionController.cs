
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


[ApiController]
[Route("api/question/")]
public class QuestionController : ControllerBase
{ 
    private readonly IQuestionService _questionService;

    public QuestionController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet("getAll")]
    public async Task<ActionResult<List<QuestionDTO>>> GetAllQuestionsAsync()
    {
        var questions = await _questionService.GetAllQuestionsAsync();
        if (questions == null || questions.Count == 0)
        {
            return NotFound("No questions found.");
        }
        return Ok(questions);
    }

    [HttpPost("add")]
    public async Task<ActionResult<bool>> AddQuestionAsync([FromBody] QuestionDTO questionDto)
    {
        if (questionDto == null)
        {
            return BadRequest("Question data is required.");
        }
        var result = await _questionService.AddQuestionAsync(questionDto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while adding the question.");
        }
        return Ok(true);
    }

    [HttpPut("updateStatus/{questionId}")]
    public async Task<ActionResult<bool>> UpdateQuestionStatusAsync(int questionId, [FromBody] string status)
    {
        if (questionId <= 0)
        {
            return BadRequest("Invalid question ID.");
        }
        var result = await _questionService.UpdateQuestionStatusAsync(questionId, status);
        if (!result)
        {
            return StatusCode(500, "An error occurred while updating the question status.");
        }
        return Ok(true);
    }

    [HttpDelete("delete/{questionId}")]
    public async Task<ActionResult<bool>> DeleteQuestionAsync(int questionId)
    {
        if (questionId <= 0)
        {
            return BadRequest("Invalid question ID.");
        }
        var result = await _questionService.DeleteQuestionAsync(questionId);
        if (!result)
        {
            return StatusCode(500, "An error occurred while deleting the question.");
        }
        return Ok(true);
    }

    [HttpPost("updateHeart")]
    public async Task<ActionResult<bool>> UpdateHeart([FromBody] QuestionDTO questionDto)
    {
        if (questionDto == null || questionDto.QuestionId <= 0)
        {
            return BadRequest("Invalid question data.");
        }
        var result = await _questionService.UpdateHeart(questionDto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while giving a heart.");
        }
        return Ok(true);
    }

    [HttpGet("getQuestion/{questionId}")]
    public async Task<ActionResult<QuestionDTO>> GetQuestionById(int questionId)
    {
        if (questionId <= 0)
        {
            return BadRequest("Invalid question ID.");
        }
        var question = await _questionService.GetQuestionById(questionId);
        if (question == null)
        {
            return NotFound("Question not found.");
        }
        return Ok(question);
    }

    [HttpGet("getByMember/{memberId}")]
    public async Task<ActionResult<List<QuestionDTO>>> GetQuestionsByMemberIdAsync(int memberId)
    {
        if (memberId <= 0)
        {
            return BadRequest("Invalid member ID.");
        }
        var questions = await _questionService.GetQuestionsByMemberIdAsync(memberId);
        if (questions == null || questions.Count == 0)
        {
            return NotFound("No questions found for this member.");
        }
        return Ok(questions);
    }

    [HttpGet("getByConsultant/{consultantId}")]
    public async Task<ActionResult<List<QuestionDTO>>> GetQuestionsByConsultantIdAsync(int consultantId)
    {
        if (consultantId <= 0)
        {
            return BadRequest("Invalid consultant ID.");
        }
        var questions = await _questionService.GetQuestionsByConsultantIdAsync(consultantId);
        if (questions == null || questions.Count == 0)
        {
            return NotFound("No questions found for this consultant.");
        }
        return Ok(questions);
    }

    [HttpGet("countAnswers/{questionId}")]
    public async Task<ActionResult<int>> CountAnswers(int questionId)
    {
        if (questionId <= 0)
        {
            return BadRequest("Invalid question ID.");
        }
        var count = await _questionService.CountAnswers(questionId);
        return Ok(count);
    }

}