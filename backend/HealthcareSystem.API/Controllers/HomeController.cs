using HealthcareSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthcareSystem.API.Controllers
{//Xử lí request từ FE để trả về dữ liệu cho trang chủ
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {

        private readonly IHomeService _homeService;

        public HomeController(IHomeService homeService)
        {
            _homeService = homeService;
        }



        [HttpGet("guest")]
        public async Task<IActionResult> GetGuestHome()
        {
            var result = await _homeService.GetGuestHomeData();
            return Ok(result);
        }

        //[Authorize(Roles = "Member")]
        //[HttpGet("member")]
        //public async Task<IActionResult> GetMemberHome()
        //{
        //    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    var result = await _homeService.GetGuestHomeData(int.Parse(userId));
        //    return Ok(result);
        //}
    }
}
