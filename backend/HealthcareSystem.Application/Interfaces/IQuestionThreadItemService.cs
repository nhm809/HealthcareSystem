using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IQuestionThreadItemService
    {
        Task<List<QuestionThreadItemDTO>> GetSubQuestionAsync(int questionId);
        Task<bool> AddSubQuestionAsync(QuestionThreadItemDTO dto);
        Task<bool> AnswerSubQuestionAsync(QuestionThreadItemDTO dto);
        Task<bool> UpdateSubQuestionAsync(int subQuestionId, QuestionThreadItemDTO dto);

    }
}