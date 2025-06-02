using Application.DTOs;
using System;
//Iservice.cs push
namespace HealthcareSystem.Application.Interfaces
{
    public interface IService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDetailDTO> GetServiceByIdAsync(int serviceId);


    }
}
