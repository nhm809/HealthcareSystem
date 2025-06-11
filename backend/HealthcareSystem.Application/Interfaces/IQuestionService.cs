
using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IQuestionService
    {
        Task<List<QuestionDTO>> GetAllQuestionsAsync();
        Task<bool> AddQuestionAsync(QuestionDTO questionDto);
        Task<bool> UpdateQuestionStatusAsync(int  questionId);
        Task<bool> DeleteQuestionAsync(int questionId);
    }

}