using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _context;
        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Invoice>> GetInvoicesByDateRangeAsync(DateRangeRequestDTO request)
        {
            DateTime actualStartDate;
            DateTime actualEndDate;

            if (request.Start.HasValue && request.End.HasValue)
            {
                actualStartDate = request.Start.Value.Date;
                actualEndDate = request.End.Value.Date;
            }
            else if (request.Month.HasValue && request.Year.HasValue)
            {
                actualStartDate = new DateTime(request.Year.Value, request.Month.Value, 1);
                actualEndDate = actualStartDate.AddMonths(1).AddDays(-1);
            }
            else if (request.Year.HasValue)
            {
                actualStartDate = new DateTime(request.Year.Value, 1, 1);
                actualEndDate = new DateTime(request.Year.Value, 12, 31);
            }
            else
            {
                throw new ArgumentException("Invalid date range parameters. Please provide Start/End, or Month/Year, or just Year.");
            }

            var invoices = await _context.Invoices
                .Where(i => i.CreatedAt.HasValue &&
                            i.CreatedAt.Value.Date >= actualStartDate.Date &&
                            i.CreatedAt.Value.Date <= actualEndDate.Date)
                .ToListAsync();

            return invoices;
        }
    }
} 