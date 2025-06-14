using Application.DTOs;
using System;

namespace Application.Interfaces
{
    public interface IService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDTO> GetServiceByIdAsync(int serviceId);

        Task<ServiceDTO> CreateServiceAsync(CreateServiceDTO createServiceDto);
        
        Task<ServiceDTO> UpdateServiceAsync(int id, CreateServiceDTO updateServiceDto);
        
        Task<bool> DeleteServiceAsync(int id);
 
        

    }
}
