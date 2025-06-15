using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
//using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        public async Task<IActionResult> GetTestRecordDetail(int testServiceRecordId, int memberId)
        {
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordByIdAsync(testServiceRecordId, memberId);
                if (result == null)
                    return StatusCode(400, new { Message = "Bản xét nghiệm không tồn tại" });
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
        
        [HttpPut("select")]
        public async Task<IActionResult> SelectTestServiceRecord(int testServiceRecordId, int staffId)
        {
            try
            {
                var result = await _testServiceRecord.SelectTestServiceRecordAsync(testServiceRecordId, staffId);
                return Ok(new
                {
                    Message = "Bạn đã nhận thành công ca xét nghiệm này. Vui lòng thực hiện xét nghiệm theo đúng quy trình và cập nhật kết quả trong thời gian sớm nhất.",
                    Data = result
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi cập nhật thông tin xét nghiệm." });
            }
        }

        [HttpPut("update-result")]
        public async Task<IActionResult> UpdateTestResult([FromBody] UpdateTestResultDTO request , int staffId)
        {
            try
            {
                var result = await _testServiceRecord.UpdateTestResultAsync(request,staffId);
                return Ok(new
                {
                    Message = "Đã cập nhật kết quả xét nghiệm thành công. Kết quả sẽ được gửi đến bệnh nhân.",
                    Data = result
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi cập nhật kết quả xét nghiệm." });
            }
        }

        [HttpPut("cancel")]
        public async Task<IActionResult> UpdateTestResult(int testServiceRecordId, int userId)
        {
            try
            {
                var result = await _testServiceRecord.CancelTestResultAsync(testServiceRecordId,userId);
                return Ok(new
                {
                    Message = "Đã hủy bỏ bản ghi",
                    Data = result
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi cập nhật kết quả xét nghiệm." });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetRecordsByStatusAsync(){
            
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordByStatusAsync();
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi lấy danh sách xét nghiệm." });
            }
        }

        [HttpGet("staff/{staffId}")]
        public async Task<IActionResult> GetRecordsByStaffIdAsync(int staffId){
            
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordByStaffIdAsync(staffId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi lấy danh sách xét nghiệm." });
            }
        }
    }
}