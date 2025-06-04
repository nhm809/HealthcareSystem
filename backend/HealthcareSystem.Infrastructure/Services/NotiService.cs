using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;

namespace Infrastructure.Services
{
    public class NotiService : INotiService
    {
        private readonly AppDbContext _context;
        public NotiService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<List<GetAllNotiDTO>> GetAllNotiAsync(int userId)
        {
            return null;
        }
    }
}
