using Application.DTOs;
using Application.Interfaces;
//using Domain.Entities;
using Microsoft.AspNetCore.Mvc;



namespace Api.Controllers
{
    //[Authorize(Roles = "MB")]
    [ApiController]
    [Route("api/[controller]")]

    public class TestServiceRecordController : ControllerBase
    {

        private readonly ITestServiceRecord _testServiceRecord;

        public TestServiceRecordController(ITestServiceRecord testServiceRecord)
        {
            _testServiceRecord = testServiceRecord;
        }
        // GET /api/testservicerecord/member/5
        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetRecordsByMemberId(int memberId)
        {
            var result = await _testServiceRecord.GetTestServiceRecordsByMemberIdAsync(memberId);
            return Ok(result);
        }

        // GET /api/testservicerecord/member/5/service/2
        [HttpGet("member/{memberId}/service/{serviceId}")]
        public async Task<IActionResult> GetTestRecordDetail(int memberId, int serviceId)
        {
            var result = await _testServiceRecord.GetTestServiceRecordByIdAsync(serviceId, memberId);
            if (result == null)
                return NotFound();
            return Ok(result);

        }
     }

    }