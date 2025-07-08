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

        [HttpPost("create-paypal-url")]
        public async Task<IActionResult> CreatePayPalUrl([FromQuery] int? testServiceRecordId, [FromQuery] int? appointmentId)
        {
            try
            {
                if (!testServiceRecordId.HasValue && !appointmentId.HasValue)
                {
                    return BadRequest(new { Message = "Phải cung cấp TestServiceRecordId hoặc AppointmentId" });
                }

                var returnUrl = $"{Request.Scheme}://{Request.Host}/api/payment/paypal-callback";
                var url = await _payPalService.CreatePaymentUrlAsync(testServiceRecordId, appointmentId, returnUrl);
                return Ok(new { PaymentUrl = url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Đã xảy ra lỗi khi tạo URL thanh toán PayPal: {ex.Message}" });
            }
        }

        [HttpGet("paypal-callback")]
        public async Task<IActionResult> PayPalCallback(string handler, string token, string PayerID, int? testServiceRecordId, int? appointmentId)
        {
            if (handler == "success" && !string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(PayerID))
            {
                try
                {
                    var result = await _payPalService.ExecutePaymentAsync(token, PayerID, testServiceRecordId, appointmentId);
                    string feUrl;
                    if (appointmentId.HasValue)
                    {
                        // Redirect về trang xác nhận lịch tư vấn
                        feUrl = $"http://localhost:5173/appointment-payment-result?handler=success&appointmentId={appointmentId}";
                    }
                    else if (testServiceRecordId.HasValue)
                    {
                        // Redirect về trang xét nghiệm
                        feUrl = $"http://localhost:5173/test-sti?handler=success&testServiceRecordId={testServiceRecordId}";
                    }
                    else
                    {
                        // Không có thông tin phù hợp
                        feUrl = "http://localhost:5173/error?message=Missing%20payment%20context";
                    }
                    return Redirect(feUrl);
                }
                catch (Exception ex)
                {
                    // Có lỗi xảy ra trong quá trình xác nhận thanh toán
                    var errorUrl = "http://localhost:5173/error?message=Payment%20failed";
                    return Redirect(errorUrl);
                }
            }
            // Trường hợp cancel hoặc không hợp lệ
            string cancelRedirect;
            if (appointmentId.HasValue)
            {
                cancelRedirect = $"http://localhost:5173/appointment-payment-result?handler=cancel&appointmentId={appointmentId}";
            }
            else if (testServiceRecordId.HasValue)
            {
                cancelRedirect = $"http://localhost:5173/test-sti?handler=cancel&testServiceRecordId={testServiceRecordId}";
            }
            else
            {
                cancelRedirect = "http://localhost:5173/error?message=Invalid%20payment%20cancel";
            }
            return Redirect(cancelRedirect);
        }
    }
}