using Application.DTOs;
using HealthcareSystem.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareSystem.Application.Interfaces
{
    public interface ITestServiceRecord
    {
        //Task<List<TestServiceRecordListDTO>> GetRecordsByStaffIdAsync(int staffId);
        //Task<TestServiceRecordDetailDTO?> GetRecordByIdAsync(int recordId);
        Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId);
        Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int testServiceRecordId, int MemberId);

        //Book a test service record for a member
        Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request);
        Task<UpdateTestServiceRecordDTO> SelectTestServiceRecordAsync(int testServiceRecordId, int staffId);
        Task<TestServiceRecordDetailDTO> UpdateTestResultAsync(UpdateTestResultDTO request , int staffId);
        Task<bool> CancelTestResultAsync(int testServiceRecordId, int userId);
    }
}
