using Application.DTOs;
using Domain.Entities;
using Application.Interfaces;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using HealthcareSystem.Application.DTOs;

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
                    Price = s.Price,
                    Description = s.Description
                })
                .ToListAsync();
        }

        public async Task<ServiceDTO?> GetServiceByIdAsync(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);
            if (service == null)
            {
                return null;
            }

            return new ServiceDTO
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price
            };
        }

        public async Task<ServiceDTO> CreateServiceAsync(CreateServiceDTO createServiceDto){
            if(createServiceDto == null)
                throw new ArgumentNullException(nameof(createServiceDto));
            
            if(string.IsNullOrEmpty(createServiceDto.Name))
                throw new ArgumentException("Điền tên dịch vụ");

            var service = new Service
            {
                Name = createServiceDto.Name,
                Price = createServiceDto.Price,
                Description = createServiceDto.Description
            };

            await _context.Services.AddAsync(service);
            await _context.SaveChangesAsync();
            
            return new ServiceDTO
            {
                Name = service.Name,
                Description = service.Description,
                Price = service.Price
            };

        }

        public async Task<ServiceDTO> UpdateServiceAsync(int id, CreateServiceDTO updateServiceDto){
            var service = await _context.Services.FindAsync(id);
            if (service == null) return null;

            service.Name = updateServiceDto.Name;
            service.Description = updateServiceDto.Description;
            service.Price = updateServiceDto.Price;

            await _context.SaveChangesAsync();
            return new ServiceDTO
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price
            };
        }


        public async Task<bool> DeleteServiceAsync(int id){
            var service = await _context.Services.FindAsync(id);
            if (service == null) return false;
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    
}