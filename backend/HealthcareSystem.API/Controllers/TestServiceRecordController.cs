using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestServiceRecordController : ControllerBase
    {
        private readonly ITestServiceRecordService _service;

        public TestServiceRecordController(ITestServiceRecordService service)
        {
            _service = service;
        }

        // Lấy danh sách tất cả các xét nghiệm do 1 staff thực hiện
        [HttpGet("staff/{staffId}")]
        public async Task<ActionResult<List<TestServiceRecordListDTO>>> GetByStaff(int staffId)
        {
            var records = await _service.GetRecordsByStaffIdAsync(staffId);
            return Ok(records);
        }

        // Lấy chi tiết của 1 bản ghi xét nghiệm
        [HttpGet("{recordId}")]
        public async Task<ActionResult<TestServiceRecordDetailDTO>> GetById(int recordId)
        {
            var record = await _service.GetRecordByIdAsync(recordId);
            if (record == null) return NotFound();
            return Ok(record);
        }
    }
}
