
using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IQuestionService
    {
        Task<List<QuestionDTO>> GetAllQuestionsAsync();
        Task<bool> AddQuestionAsync(QuestionDTO questionDto);
        Task<bool> UpdateQuestionStatusAsync(int questionId, string status);
        Task<bool> DeleteQuestionAsync(int questionId);
        Task<bool> UpdateHeart(QuestionDTO questionDto);
        Task<QuestionDTO> GetQuestionById(int questionId);
        Task<List<QuestionDTO>> GetQuestionsByMemberIdAsync(int memberId);
        Task<List<QuestionDTO>> GetQuestionsByConsultantIdAsync(int consultantId);
        Task<int> CountAnswers(int questionId);
    }

}