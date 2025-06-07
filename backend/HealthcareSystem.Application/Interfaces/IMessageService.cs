using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IMessageService
    {
        Task<List<MessageDTO>> GetMessagesHistoryAsync(int questionId);
        Task<bool> AddMessageAsync(MessageDTO messageDto);
        //Task<bool> UpdateMessageAsync(MessageDTO messageDto);
    }
}