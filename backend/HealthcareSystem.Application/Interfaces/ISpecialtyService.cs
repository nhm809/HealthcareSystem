
using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ISpecialtyService
    {
        Task<IEnumerable<SpecialtyDTO>> GetAllAsync();
        Task<SpecialtyDTO> GetByIdAsync(int id);
        Task<List<SpecialtyDTO>> GetByUserIdAsync(int userId);
        Task<SpecialtyDTO> CreateAsync(SpecialtyDTO specialtyDto);
        Task<bool> UpdateAsync(SpecialtyDTO specialtyDto);
        Task<bool> DeleteAsync(int id);
    }
}