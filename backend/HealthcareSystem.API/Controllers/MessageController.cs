
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


[ApiController]
[Route("api/message/")]

public class MessageController : ControllerBase
{

    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    [Route("getHistory/{questionId}")]
    public async Task<ActionResult<List<MessageDTO>>> GetMessagesHistoryAsync(int questionId)
    {
        var messages = await _messageService.GetMessagesHistoryAsync(questionId);
        if (messages == null || messages.Count == 0)
        {
            return NotFound("No messages found for this question.");
        }
        return Ok(messages);
    }

    [HttpPost]
    [Route("add")]
    public async Task<ActionResult<bool>> AddMessageAsync([FromBody] MessageDTO messageDto)
    {
        if (messageDto == null)
        {
            return BadRequest("Message data is required.");
        }
        var result = await _messageService.AddMessageAsync(messageDto);
        if (!result)
        {
            return StatusCode(500, "An error occurred while adding the message.");
        }
        return Ok(true);
    }

}
