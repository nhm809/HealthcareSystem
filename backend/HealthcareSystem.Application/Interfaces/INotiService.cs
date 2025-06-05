using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface INotiService
    {
        Task<List<NotiDTO>> GetAllNotiAsync(int userId);
        Task<bool> CreateNotiAsync(CreateNotiDTO createNotiDTO);
        Task<int> MarkAsReadAsync(int notiId);
    }
}