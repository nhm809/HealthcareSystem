using HealthcareSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
//ServiceController.cs push
namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IService _service;

        public ServiceController(IService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _service.GetAllServicesAsync();
            return Ok(services);
        }

        [HttpGet("{serviceId:int}")]
        public async Task<IActionResult> GetServiceById(int serviceId)
        {
            var service = await _service.GetServiceByIdAsync(serviceId);
            if (service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }

    }

}