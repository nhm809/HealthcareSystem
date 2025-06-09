using Application.DTOs;
using Application.Interfaces;
//using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class TestServiceRecordController : ControllerBase
    {

        private readonly ITestServiceRecord _testServiceRecord;

        public TestServiceRecordController(ITestServiceRecord testServiceRecord)
        {
            _testServiceRecord = testServiceRecord;
        }
        // GET /api/testservicerecord/member/5
        [HttpGet("member/{memberId}")]
        //[Authorize(Roles = "MB")]
        public async Task<IActionResult> GetRecordsByMemberId(int memberId)
        {
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordsByMemberIdAsync(memberId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi lấy danh sách kết quả xét nghiệm." });
            }
        }

        // GET /api/testservicerecord/5/2
        [HttpGet("{testServiceRecordId}/{memberId}")]
        //[Authorize(Roles = "MB")]
        public async Task<IActionResult> GetTestRecordDetail(int testServiceRecordId, int memberId)
        {
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordByIdAsync(testServiceRecordId, memberId);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi lấy chi tiết kết quả xét nghiệm." });
            }

        }

        // POST /api/testservicerecord/book
        [HttpPost("book")]
        public async Task<IActionResult> BookTestService([FromBody] BookTestServiceRecordDTO request)
        {
            try
            {
                var testServiceRecordID = await _testServiceRecord.BookTestServiceAsync(request);
                return Ok(new
                {
                    TestServiceRecordID = testServiceRecordID,
                    Message = "Thông tin đặt lịch đã được lưu. Vui lòng tiến hành thanh toán."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi đặt lịch xét nghiệm." });
            }
        }
    }
}