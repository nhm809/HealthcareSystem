
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{

    public interface IReproductiveCycleService
    {
        Task<IEnumerable<ReproductiveCycleDTO>> GetReproductiveCycleAsync(int memberId);
        Task<ReproductiveCycleDTO> UpdateReproductiveCycleAsync(ReproductiveCycleDTO cycleDto);
        Task<ReproductiveCycleDTO> AddReproductiveCycleInfoAsync(ReproductiveCycleDTO cycleDto);
        Task<bool> DeleteReproductiveCycleAsync(int cycleId);
    }
}