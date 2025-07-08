using HealthcareSystem.Application.DTOs;
using HealthcareSystem.Application.Interfaces;
//using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Globalization;
using System.Collections.Generic;

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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi lấy danh sách kết quả xét nghiệm: {ex.Message}" });
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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi lấy chi tiết kết quả xét nghiệm: {ex.Message}" });
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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi đặt lịch xét nghiệm: {ex.Message}" });
            }
        }

        // [HttpGet("available-slots")]
        // public async Task<IActionResult> GetAvailableTimeSlots([FromQuery] string date)
        // {
        //     try
        //     {
        //         if (!DateOnly.TryParse(date, out var parsedDate))
        //         {
        //             return BadRequest("Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD.");
        //         }

        //         var slots = await _testServiceRecord.GetAvailableTimeSlotsAsync(parsedDate);
        //         return Ok(slots);
        //     }
        //     catch (Exception ex)
        //     {
        //         // Ghi log lỗi ở đây nếu cần
        //         return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy danh sách khung giờ.", details = ex.Message });
        //     }
        // }
        
        // [HttpPut("select")]
        // public async Task<IActionResult> SelectTestServiceRecord(int testServiceRecordId, int staffId)
        // {
        //     try
        //     {
        //         var result = await _testServiceRecord.SelectTestServiceRecordAsync(testServiceRecordId, staffId);
        //         return Ok(new
        //         {
        //             Message = "Bạn đã nhận thành công ca xét nghiệm này. Vui lòng thực hiện xét nghiệm theo đúng quy trình và cập nhật kết quả trong thời gian sớm nhất.",
        //             Data = result
        //         });
        //     }
        //     catch (ArgumentException ex)
        //     {
        //         return BadRequest(new { Message = ex.Message });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { Message = "Đã xảy ra lỗi khi cập nhật thông tin xét nghiệm." });
        //     }
        // }

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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi cập nhật kết quả xét nghiệm: {ex.Message}" });
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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi hủy bỏ bản ghi: {ex.Message}" });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetRecordsByStatusAsync([FromQuery] string status)
        {
            try
            {
                var result = await _testServiceRecord.GetTestServiceRecordByStatusAsync(status);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi lấy danh sách xét nghiệm: {ex.Message}" });
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
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi lấy danh sách xét nghiệm: {ex.Message}" });
            }
        }

        [HttpGet("work-shifts")]
        public async Task<IActionResult> GetWorkShifts([FromQuery] string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var parsedDate))
                {
                    return BadRequest("Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD.");
                }

                var shifts = await _testServiceRecord.GetWorkShiftsAsync(parsedDate);
                return Ok(shifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy thông tin ca làm việc.", details = ex.Message });
            }
        }

        [HttpGet("available-staff")]
        public async Task<IActionResult> GetAvailableStaffByDay([FromQuery] string date)
        {
            try
            {
                if (!DateOnly.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                {
                    return BadRequest("Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM-dd.");
                }

                var workShifts = await _testServiceRecord.GetWorkShiftsAsync(parsedDate);
                var result = new List<object>();

                foreach (var shift in workShifts)
                {
                    var staffIds = await _testServiceRecord.GetAvailableStaffForShiftAsync(parsedDate, shift.ShiftId);
                    result.Add(new 
                    {
                        ShiftId = shift.ShiftId,
                        ShiftName = shift.ShiftName,
                        StartTime = shift.StartTime,
                        EndTime = shift.EndTime,
                        AvailableStaff = staffIds
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy danh sách nhân viên có thể làm việc.", details = ex.Message });
            }
        }
    }
}