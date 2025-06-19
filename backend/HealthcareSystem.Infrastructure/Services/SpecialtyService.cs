
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure.data;

namespace Infrastructure.Services
{
    
    public class SpecialtyService : ISpecialtyService
    {
        private readonly AppDbContext _context;
        public SpecialtyService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<SpecialtyDTO>> GetAllAsync()
        {
            return await _context.Set<Specialty>()
                .Select(s => new SpecialtyDTO
                {
                    Id = s.SpecialtyId,
                    Name = s.Name,
                    Description = s.Description
                }).ToListAsync();
        }

        public async Task<SpecialtyDTO> GetByIdAsync(int id)
        {
            var specialty = await _context.Set<Specialty>().FindAsync(id);
            if (specialty == null) return null;
            return new SpecialtyDTO
            {
                Id = specialty.SpecialtyId,
                Name = specialty.Name,
                Description = specialty.Description
            };
        }


        public async Task<SpecialtyDTO> CreateAsync(SpecialtyDTO specialtyDto)
        {
            var specialty = new Specialty
            {
                Name = specialtyDto.Name,
                Description = specialtyDto.Description
            };
            _context.Set<Specialty>().Add(specialty);
            await _context.SaveChangesAsync();
            specialtyDto.Id = specialty.SpecialtyId;
            return specialtyDto;
        }
        public async Task<SpecialtyDTO> UpdateAsync(SpecialtyDTO specialtyDto)
        {
            var specialty = await _context.Set<Specialty>().FindAsync(specialtyDto.Id);
            if (specialty == null) return null;
            specialty.Name = specialtyDto.Name;
            specialty.Description = specialtyDto.Description;
            _context.Set<Specialty>().Update(specialty);
            await _context.SaveChangesAsync();
            return specialtyDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var specialty = await _context.Set<Specialty>().FindAsync(id);
            if (specialty == null) return false;
            _context.Set<Specialty>().Remove(specialty);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}