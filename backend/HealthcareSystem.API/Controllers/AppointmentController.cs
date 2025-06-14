using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;

        public AppointmentController(IAppointmentService service)
        {
            _service = service;
        }

        /// <summary>
        /// [1] TẠO lịch tư vấn
        /// POST: api/appointment/create
        /// Body JSON:
        /// {
        ///   "memberId": 5,
        ///   "serviceId": 2,
        ///   "consultantId": 4,
        ///   "startTime": "2025-06-10T10:00:00",
        ///   "endTime":   "2025-06-10T10:30:00",
        ///   "meetLink":  "https://meet.link/abc123"
        /// }
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
        {
            // 1. Validate dữ liệu bổ sung (ví dụ: start < end)
            if (dto.StartTime >= dto.EndTime)
            {
                return BadRequest(new
                {
                    success = false,
                    data = (object?)null,
                    message = "Thời gian bắt đầu phải trước thời gian kết thúc."
                });
            }

            try
            {
                var newId = await _service.CreateAppointmentAsync(dto);
                return Ok(new
                {
                    success = true,
                    data = newId,
                    message = "Đặt lịch tư vấn thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    data = (object?)null,
                    message = $"Lỗi khi tạo lịch: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// [2] LẤY DANH SÁCH TẤT CẢ lịch hẹn (rút gọn)
        /// GET: api/appointment/list
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = await _service.GetAllAppointmentsAsync();
                return Ok(new
                {
                    success = true,
                    data = list,
                    message = "Lấy danh sách lịch hẹn thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    data = (object?)null,
                    message = $"Lỗi khi lấy danh sách: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// [3] LẤY CHI TIẾT một lịch hẹn
        /// GET: api/appointment/detail/{id}
        /// </summary>
        [HttpGet("detail/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var dto = await _service.GetAppointmentByIdAsync(id);
                if (dto == null)
                    return NotFound(new
                    {
                        success = false,
                        data = (object?)null,
                        message = $"Không tìm thấy lịch hẹn với ID = {id}."
                    });

                return Ok(new
                {
                    success = true,
                    data = dto,
                    message = "Lấy chi tiết lịch hẹn thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    data = (object?)null,
                    message = $"Lỗi khi lấy chi tiết: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// [4] (Tuỳ chọn) CẬP NHẬT trạng thái của lịch hẹn
        /// PATCH: api/appointment/update-status/{id}
        /// Body JSON: { "newStatus": "Đã hoàn thành" }
        /// </summary>
        [HttpPatch("update-status/{id:int}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            try
            {
                var ok = await _service.UpdateAppointmentStatusAsync(id, newStatus);
                if (!ok)
                    return NotFound(new
                    {
                        success = false,
                        data = (object?)null,
                        message = $"Không tìm thấy lịch hẹn với ID = {id}."
                    });

                return Ok(new
                {
                    success = true,
                    data = (object?)null,
                    message = "Cập nhật trạng thái thành công."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    data = (object?)null,
                    message = $"Lỗi khi cập nhật trạng thái: {ex.Message}"
                });
            }
        }
    }

}
