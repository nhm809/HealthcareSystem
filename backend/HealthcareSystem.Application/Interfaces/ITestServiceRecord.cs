using Application.DTOs;
using HealthcareSystem.Application.DTOs;
using System;

namespace Application.Interfaces
{
    public interface ITestServiceRecord
    {
        Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId);
        Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int ServiceId, int MemberId);

        //Book a test service record for a member
        Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request);
    }
}
