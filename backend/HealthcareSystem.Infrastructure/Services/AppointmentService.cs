using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.data;

namespace Infrastructure.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAppointmentAsync(AppointmentCreateDto dto)
        {
            // Chuyển DTO sang Entity
            var entity = new Appointment
            {
                MemberId = dto.MemberId,
                ServiceId = dto.ServiceId,
                ConsultantId = dto.ConsultantId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                MeetLink = dto.MeetLink,
                Status = "Đã đặt"   // giá trị mặc định
            };

            await _context.Appointments.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity.AppointmentId;
        }

        public async Task<IEnumerable<AppointmentListItemDto>> GetAllAppointmentsAsync()
        {
            // Lấy danh sách từ DB và project sang DTO
            var list = await _context.Appointments
                .Include(a => a.Member)      // nếu cần tên Member
                .Include(a => a.Consultant)  // nếu cần tên Consultant
                .Select(a => new AppointmentListItemDto
                {
                    AppointmentId = a.AppointmentId,
                    MemberId = a.MemberId!.Value,
                    MemberName = a.Member!.FullName!,
                    ConsultantId = a.ConsultantId!.Value,
                    ConsultantName = a.Consultant!.FullName!,
                    StartTime = a.StartTime!.Value,
                    EndTime = a.EndTime!.Value,
                    Status = a.Status!
                })
                .ToListAsync();

            return list;
        }

        public async Task<AppointmentDetailDto?> GetAppointmentByIdAsync(int appointmentId)
        {
            var a = await _context.Appointments
                .Include(x => x.Member)
                .Include(x => x.Consultant)
                .Include(x => x.Service)
                .FirstOrDefaultAsync(x => x.AppointmentId == appointmentId);

            if (a == null) return null;

            return new AppointmentDetailDto
            {
                AppointmentId = a.AppointmentId,
                MemberId = a.MemberId!.Value,
                MemberName = a.Member!.FullName!,
                ConsultantId = a.ConsultantId!.Value,
                ConsultantName = a.Consultant!.FullName!,
                ServiceId = a.ServiceId!.Value,
                ServiceName = a.Service!.Name!,
                StartTime = a.StartTime!.Value,
                EndTime = a.EndTime!.Value,
                Status = a.Status!,
                MeetLink = a.MeetLink
            };
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string newStatus)
        {
            var a = await _context.Appointments.FindAsync(appointmentId);
            if (a == null) return false;

            a.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
