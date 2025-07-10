using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace HealthcareSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpPost("search-by-date")]
        public async Task<ActionResult<List<Invoice>>> GetInvoicesByDateRange([FromBody] DateRangeRequestDTO request)
        {
            var result = await _invoiceService.GetInvoicesByDateRangeAsync(request);
            return Ok(result);
        }
    }
} 