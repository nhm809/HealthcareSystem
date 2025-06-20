using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using System.Security.Claims;

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

        [HttpPost] 
        public async  Task<IActionResult> CreateService(CreateServiceDTO createdServiceDto){
            try{
                var service = await _service.CreateServiceAsync(createdServiceDto);
                return Ok(service);
            }catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] CreateServiceDTO updateServiceDto)
        {
            var updatedService = await _service.UpdateServiceAsync(id, updateServiceDto);
            if (updatedService == null)
                return NotFound();

            return Ok(updatedService);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var result = await _service.DeleteServiceAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Dịch vụ không tồn tại" });

            return Ok(new { success = true, message = "Đã xóa" });
        }



    }

}