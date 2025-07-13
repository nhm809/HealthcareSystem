
using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.data;
using System.Net.Sockets;
using System.Collections;
using System.Collections.Generic;
using Domain.Entities;
using System.Linq;

namespace Infrastructure.Services
{
    public class ReproductiveCycleService : IReproductiveCycleService
    {
        private readonly AppDbContext _context;

        public ReproductiveCycleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReproductiveCycleDTO>> GetReproductiveCycleAsync(int memberId)
        {
            var cycles = await _context.ReproductiveCycles
                .Where(c => c.MemberId == memberId)
                .OrderByDescending(c => c.StartDate)
                .ToListAsync();

            var result = new List<ReproductiveCycleDTO>();

            foreach (var cycle in cycles)
            {
                if (!cycle.StartDate.HasValue || !cycle.CycleLength.HasValue)
                    continue;

                var startDate = cycle.StartDate.Value;
                var cycleLength = cycle.CycleLength.Value;
                var endDate = startDate.AddDays(cycleLength);
                var ovulationDate = startDate.AddDays((cycleLength + 1) - 14);
                var fertileStart = ovulationDate.AddDays(-2);
                var fertileEnd = ovulationDate.AddDays(2);

                result.Add(new ReproductiveCycleDTO
                {
                    CycleId = cycle.CycleId,
                    MemberId = cycle.MemberId,
                    StartDate = cycle.StartDate,
                    EndDate = endDate,
                    OvulationDate = ovulationDate,
                    CycleLength = cycle.CycleLength,
                    PeriodLength = cycle.PeriodLength,
                    PillTime = cycle.PillTime,
                    FertileStart = fertileStart,
                    FertileEnd = fertileEnd,
                    LastUpdated = DateTime.UtcNow
                });
            }

            return result;
        }


        public async Task<ReproductiveCycleDTO> UpdateReproductiveCycleAsync(ReproductiveCycleDTO cycleDto)
        {
            var cycle = await _context.ReproductiveCycles.FindAsync(cycleDto.CycleId);
            if (cycle == null) return null;

            cycle.StartDate = cycleDto.StartDate;
            cycle.CycleLength = cycleDto.CycleLength;
            cycle.PeriodLength = cycleDto.PeriodLength;
            cycle.PillTime = cycleDto.PillTime;
            cycle.LastUpdated = DateTime.UtcNow;

            DateOnly? endDate = null;
            DateOnly? ovulationDate = null;
            DateOnly? fertileStart = null;
            DateOnly? fertileEnd = null;

            if (cycle.StartDate.HasValue && cycle.CycleLength.HasValue)
            {
                var start = cycle.StartDate.Value;
                var length = cycle.CycleLength.Value;

                endDate = start.AddDays(length);
                ovulationDate = start.AddDays((length + 1) - 14);
                fertileStart = ovulationDate.Value.AddDays(-2);
                fertileEnd = ovulationDate.Value.AddDays(2);
            }

            _context.ReproductiveCycles.Update(cycle);
            await _context.SaveChangesAsync();

            return new ReproductiveCycleDTO
            {
                CycleId = cycle.CycleId,
                MemberId = cycle.MemberId,
                StartDate = cycle.StartDate,
                EndDate = endDate,
                OvulationDate = ovulationDate,
                CycleLength = cycle.CycleLength,
                PeriodLength = cycle.PeriodLength,
                PillTime = cycle.PillTime,
                FertileStart = fertileStart,
                FertileEnd = fertileEnd,
                LastUpdated = cycle.LastUpdated
            };
        }

        public async Task<ReproductiveCycleDTO> AddReproductiveCycleInfoAsync(ReproductiveCycleDTO cycleDto)
        {
            var cycle = new ReproductiveCycle
            {
                MemberId = cycleDto.MemberId,
                StartDate = cycleDto.StartDate,
                CycleLength = cycleDto.CycleLength,
                PeriodLength = cycleDto.PeriodLength,
                PillTime = cycleDto.PillTime,
                LastUpdated = DateTime.UtcNow
            };

            await _context.ReproductiveCycles.AddAsync(cycle);
            await _context.SaveChangesAsync();

            DateOnly? endDate = null, ovulationDate = null, fertileStart = null, fertileEnd = null;

            if (cycle.StartDate.HasValue && cycle.CycleLength.HasValue)
            {
                var start = cycle.StartDate.Value;
                var length = cycle.CycleLength.Value;
                endDate = start.AddDays(length);
                ovulationDate = start.AddDays((length + 1) - 14);
                fertileStart = ovulationDate.Value.AddDays(-2);
                fertileEnd = ovulationDate.Value.AddDays(2);
            }

            return new ReproductiveCycleDTO
            {
                CycleId = cycle.CycleId,
                MemberId = cycle.MemberId,
                StartDate = cycle.StartDate,
                EndDate = endDate,
                OvulationDate = ovulationDate,
                CycleLength = cycle.CycleLength,
                PeriodLength = cycle.PeriodLength,
                PillTime = cycle.PillTime,
                FertileStart = fertileStart,
                FertileEnd = fertileEnd,
                LastUpdated = cycle.LastUpdated
            };
        }



        public async Task<bool> DeleteReproductiveCycleAsync(int cycleId)
        {
            var cycle = await _context.ReproductiveCycles.FindAsync(cycleId);
            if (cycle == null)
                return false;

            _context.ReproductiveCycles.Remove(cycle);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}