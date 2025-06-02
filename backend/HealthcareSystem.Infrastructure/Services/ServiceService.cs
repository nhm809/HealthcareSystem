using Application.DTOs;
using Domain.Entities;
using HealthcareSystem.Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
//ServiceService.cs push
namespace Infrastructure.Services
{
    public class ServiceService : IService
    {
        private readonly AppDbContext _context;

        public ServiceService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<ServiceDTO>> GetAllServicesAsync()
        {
            return await _context.Services
                .Select(s => new ServiceDTO
                {
                    ServiceId = s.ServiceId,
                    Name = s.Name,
                    Price = s.Price
                })
                .ToListAsync();
        }

        public async Task<ServiceDetailDTO?> GetServiceByIdAsync(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);
            if (service == null)
            {
                return null;
            }

            return new ServiceDetailDTO
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price
            };
        }
    }


}