using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
public interface ITestServiceRecordService
{
    Task<List<TestServiceRecordListDTO>> GetRecordsByStaffIdAsync(int staffId);
    Task<TestServiceRecordDetailDTO?> GetRecordByIdAsync(int recordId);
}
