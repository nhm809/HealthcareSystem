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
            /// <param name="dto">Thông tin tạo lịch (MemberId, ServiceId, ...)</param>
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
            /// (Tuỳ chọn) Cập nhật trạng thái hoặc chỉnh sửa thông tin lịch hẹn.
            /// </summary>
            Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string newStatus);
        }
    }


