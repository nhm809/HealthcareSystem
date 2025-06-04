using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface INotiService
    {
        Task<List<GetAllNotiDTO>> GetAllNotiAsync(int userId);
        //Task<int> CreateNotiAsync(CreateNotiDTO createNotiDTO);
        //Task<int> MarkAsReadAsync(int notiId);
    }
}