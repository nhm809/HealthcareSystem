using Application.DTOs;
using HealthcareSystem.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
public interface ITestServiceRecord
{
    //Task<List<TestServiceRecordListDTO>> GetRecordsByStaffIdAsync(int staffId);
    //Task<TestServiceRecordDetailDTO?> GetRecordByIdAsync(int recordId);
    Task<IEnumerable<TestServiceRecordDTO>> GetTestServiceRecordsByMemberIdAsync(int MemberId);
    Task<TestServiceRecordDetailDTO?> GetTestServiceRecordByIdAsync(int testServiceRecordId, int MemberId);

    //Book a test service record for a member
    Task<int> BookTestServiceAsync(BookTestServiceRecordDTO request);
}
