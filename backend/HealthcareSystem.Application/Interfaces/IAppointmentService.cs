using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{

    public interface IAppointmentService
    {
        /// <summary>
        /// Tạo mới một lịch hẹn, trả về ID nếu thành công.
        /// </summary>
        /// <param name="dto">Thông tin tạo lịch (MemberId, ServiceId, ..., Symptoms)</param>
        /// <returns>ID của Appointment vừa tạo</returns>
        Task<int> CreateAppointmentAsync(AppointmentCreateDto dto);

        /// <summary>
        /// Lấy toàn bộ danh sách lịch hẹn (dạng rút gọn).
        /// </summary>
        Task<IEnumerable<AppointmentListItemDto>> GetAllAppointmentsAsync();

        /// <summary>
        /// Lấy chi tiết một lịch hẹn theo ID.
        /// </summary>
        /// <param name="appointmentId">ID của lịch cần lấy</param>
        Task<AppointmentDetailDto?> GetAppointmentByIdAsync(int appointmentId);

        /// <summary>
        /// Lấy danh sách lịch hẹn theo MemberId.
        /// </summary>
        /// <param name="userId">ID của thành viên</param>
        Task<IEnumerable<AppointmentListItemDto>> GetAppointmentsByUserIdAsync(int userId);

        /// <summary>
        /// Cập nhật trạng thái của lịch hẹn.
        /// </summary>
        Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string newStatus);

        /// <summary>
        /// Cập nhật link Google Meet cho lịch hẹn.
        /// </summary>
        /// <param name="appointmentId">ID của lịch hẹn</param>
        /// <param name="meetLink">Link Google Meet mới</param>
        Task<bool> UpdateAppointmentMeetLinkAsync(int appointmentId, string meetLink);
    }
}