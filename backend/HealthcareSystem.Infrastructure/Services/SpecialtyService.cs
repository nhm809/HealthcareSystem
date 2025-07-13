
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
            return await _context.Specialties
                .Where(s => !s.IsDeleted) 
                .Select(s => new SpecialtyDTO
                {
                    Id = s.SpecialtyId,
                    Name = s.Name,
                    Description = s.Description,
                    IsDeleted = s.IsDeleted
                }).ToListAsync();
        }

        public async Task<SpecialtyDTO> GetByIdAsync(int id)
        {
            var specialty = await _context.Specialties.FindAsync(id);
            if (specialty == null) return null;
            return new SpecialtyDTO
            {
                Id = specialty.SpecialtyId,
                Name = specialty.Name,
                Description = specialty.Description,
                IsDeleted = specialty.IsDeleted

            };
        }

        public async Task<List<SpecialtyDTO>> GetByUserIdAsync(int userId)
        {
            var specialties = await _context.Specialties
                .Where(s => s.Users.Any(u => u.UserId == userId) && !s.IsDeleted)
                .ToListAsync();

            return specialties.Select(s => new SpecialtyDTO
            {
                Id = s.SpecialtyId,
                Name = s.Name,
                Description = s.Description
            }).ToList();
        }

        public async Task<SpecialtyDTO> CreateAsync(SpecialtyDTO specialtyDto)
        {
            var specialty = new Specialty
            {
                Name = specialtyDto.Name,
                Description = specialtyDto.Description,
                IsDeleted = false
            };
            _context.Specialties.Add(specialty);
            await _context.SaveChangesAsync();

            return new SpecialtyDTO
            {
                Id = specialty.SpecialtyId,
                Name = specialty.Name,
                Description = specialty.Description,
                IsDeleted = specialty.IsDeleted
            };

        }



        public async Task<bool> UpdateAsync(SpecialtyDTO specialtyDto)
        {
            var specialty = await _context.Specialties.FindAsync(specialtyDto.Id);
            if (specialty == null) return false; 

            if (!string.IsNullOrEmpty(specialtyDto.Name))
                specialty.Name = specialtyDto.Name;

            if (!string.IsNullOrEmpty(specialtyDto.Description))
                specialty.Description = specialtyDto.Description;

            _context.Specialties.Update(specialty);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var specialty = await _context.Specialties.FindAsync(id);
            if (specialty == null) return false;
            specialty.IsDeleted = true; 
            _context.Specialties.Update(specialty);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}