
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface IFeedbackService
    {
        Task<bool> SubmitFeedbackAsync(FeedbackDTO dto);
        Task<IEnumerable<FeedbackDTO>> GetFeedbackByAppointmentIdAsync(int appointmentId);
        Task<IEnumerable<FeedbackDTO>> GetFeedbackByRecordIdAsync(int recordId);
        Task<IEnumerable<FeedbackDTO>> GetAllFeedbackAsync();
    }
}
