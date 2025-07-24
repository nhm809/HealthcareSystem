using Application.DTOs;
using HealthcareSystem.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareSystem.Application.Interfaces
{
    public interface ITestServiceRecord
    {

        Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId);
        Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int testServiceRecordId, int MemberId);
        

        Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request);
        // Task<IEnumerable<TimeSpan>> GetAvailableTimeSlotsAsync(DateOnly date);
        Task<IEnumerable<WorkShiftDTO>> GetWorkShiftsAsync(DateOnly date);
        // Task<UpdateTestServiceRecordDTO> SelectTestServiceRecordAsync(int testServiceRecordId, int staffId);
        Task<TestServiceRecordDetailDTO> UpdateTestResultAsync(UpdateTestResultDTO request , int staffId);
        Task<bool> CancelTestResultAsync(int testServiceRecordId, int userId);

        Task<IEnumerable<TestServiceRecordStaffDTO>> GetTestServiceRecordByStatusAsync(string status);
        Task<IEnumerable<TestServiceRecordStaffDTO>> GetTestServiceRecordByStaffIdAsync(int staffId);
        Task<List<int>> GetAvailableStaffForShiftAsync(DateOnly date, int shift);

        Task<bool> CanBookTestService(BookTestServiceRecordDTO request);
        Task AssignStaffToTestRecordAsync(int testServiceRecordId);
    }
}
