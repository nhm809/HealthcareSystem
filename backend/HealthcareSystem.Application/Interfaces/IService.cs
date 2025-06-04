using Application.DTOs;
using System;

namespace Application.Interfaces
{
    public interface IService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDetailDTO?> GetServiceByIdAsync(int serviceId);


    }
}
