using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;

namespace Infrastructure.Services
{
    public class TestServiceRecordService : ITestServiceRecordService
    {
        private readonly AppDbContext _context;

        public TestServiceRecordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TestServiceRecordListDTO>> GetRecordsByStaffIdAsync(int staffId)
        {
            return await _context.TestServiceRecords
                .Where(r => r.StaffId == staffId)
                .Include(r => r.Service)
                .OrderByDescending(r => r.RecordDate)
                .Select(r => new TestServiceRecordListDTO
                {
                    RecordID = r.TestServiceRecordId,
                    FullNameOfMember = r.FullNameOfMember,
                    ServiceName = r.Service.Name,
                    Status = r.Status,
                    RecordDate = r.RecordDate
                })
                .ToListAsync();
        }

        public async Task<TestServiceRecordDetailDTO?> GetRecordByIdAsync(int recordId)
        {
            var record = await _context.TestServiceRecords
                .Include(r => r.Service)
                .FirstOrDefaultAsync(r => r.TestServiceRecordId == recordId);

            if (record == null) return null;

            return new TestServiceRecordDetailDTO
            {
                RecordID = record.TestServiceRecordId,
                FullNameOfMember = record.FullNameOfMember,
                Gender = record.Gender,
                Dob = record.Dob,
                PhoneNumber = record.PhoneNumber,
                ServiceName = record.Service.Name,
                Result = record.Result,
                Notes = record.Notes,
                Status = record.Status,
                RecordDate = record.RecordDate
            };
        }
    }
}