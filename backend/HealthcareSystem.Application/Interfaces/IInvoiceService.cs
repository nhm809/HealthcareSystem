using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IInvoiceService
    {
        Task<List<Invoice>> GetInvoicesByDateRangeAsync(DateRangeRequestDTO request);
    }
} 