using HealthcareSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPayPalService _payPalService;

        public PaymentController(IPayPalService payPalService)
        {
            _payPalService = payPalService;
        }

        [HttpPost("create-paypal-url/{testServiceRecordId}")]
        public async Task<IActionResult> CreatePayPalUrl(int testServiceRecordId)
        {
            try
            {
                var returnUrl = $"{Request.Scheme}://{Request.Host}/api/payment/paypal-callback";
                var url = await _payPalService.CreatePaymentUrlAsync(testServiceRecordId, returnUrl);
                return Ok(new { PaymentUrl = url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi tạo URL thanh toán PayPal." });
            }
        }

        [HttpGet("paypal-callback")]
        public async Task<IActionResult> PayPalCallback(string handler, string token, string PayerID, int testServiceRecordId)
        {
            if (handler == "success" && !string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(PayerID))
            {
                var result = await _payPalService.ExecutePaymentAsync(token, PayerID, testServiceRecordId);
                return Ok(new { Message = "Thanh toán PayPal thành công!", Result = result });
            }
            return BadRequest(new { Message = "Thanh toán bị hủy hoặc thất bại." });
        }
    }
}