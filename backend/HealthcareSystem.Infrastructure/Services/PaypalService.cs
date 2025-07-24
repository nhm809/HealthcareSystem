using Google;
using Google.Apis.Http;
using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.DTOs;
using Domain.Entities;
using HealthcareSystem.Application.Interfaces;

using Application.Interfaces;

namespace HealthcareSystem.Infrastructure.Services
{
    public class PayPalService : IPayPalService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly ILogger<PayPalService> _logger;
        private const string PAYMENT_PENDING_STATUS = "Dang thanh toan";
        private readonly INotiService _notiService;
        private readonly ITestServiceRecord _testServiceRecordService;
        const decimal taxRate = 0.05m;

        public PayPalService(IConfiguration configuration, AppDbContext context, System.Net.Http.IHttpClientFactory httpClientFactory, ILogger<PayPalService> logger, INotiService notiService, ITestServiceRecord testServiceRecordService)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _httpClient = httpClientFactory.CreateClient("PayPalClient");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _notiService = notiService;
            _testServiceRecordService = testServiceRecordService;
        }

        //private bool IsPaymentPendingStatus(string status)
        //{
        //    return status.Equals(PAYMENT_PENDING_STATUS, StringComparison.OrdinalIgnoreCase);
        //}

        private async Task<string> GetAccessTokenAsync()
        {
            try
            {
                //1 onfiguration
                var clientId = _configuration["PayPal:ClientId"] ?? throw new ArgumentNullException("PayPal:ClientId is not configured.");
                var secret = _configuration["PayPal:Secret"] ?? throw new ArgumentNullException("PayPal:Secret is not configured.");
                //2. từ bytes về base64 
                var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secret}"));
                //3.tạo request lụm token
                var request = new HttpRequestMessage(HttpMethod.Post, "/v1/oauth2/token")
                {
                    Headers = { Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authString) },
                    Content = new FormUrlEncodedContent(new Dictionary<string, string>
                    {
                        { "grant_type", "client_credentials" }
                    })
                };

                _logger.LogInformation("Gửi yêu cầu lấy Access Token tới PayPal...");
                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Lỗi khi lấy Access Token: {response.StatusCode} - {errorContent}");
                    throw new HttpRequestException($"Failed to get PayPal access token: {response.StatusCode} - {errorContent}");
                }

                var content = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<PayPalTokenResponseDTO>(content) ?? throw new InvalidOperationException("Failed to deserialize PayPal token response.");
                return tokenResponse.access_token;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi không xác định khi lấy Access Token từ PayPal.");
                throw;
            }
        }

        public async Task<string> CreatePaymentUrlAsync(int? testServiceRecordId, int? appointmentId, string returnUrl)
        {
            try
            {
                decimal amount = 0;
                string description = "";
                string status = "";

                if (testServiceRecordId.HasValue)
                {
                    var testServiceRecord = await _context.TestServiceRecords
                        .Include(r => r.Service)
                        .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId);

                    if (testServiceRecord == null || testServiceRecord.Service == null)
                        throw new ArgumentException("Bản ghi hoặc dịch vụ không tồn tại");

                    if (!testServiceRecord.Status.Trim().Equals(PAYMENT_PENDING_STATUS.Trim(), StringComparison.OrdinalIgnoreCase))
                    {   
                        _logger.LogError($"TestServiceRecord Status không hợp lệ. Expected: '{PAYMENT_PENDING_STATUS.Trim()}', Actual: '{testServiceRecord.Status.Trim()}'");
                        throw new ArgumentException("Bản ghi không ở trạng thái chờ thanh toán.");
                    }

                    amount = testServiceRecord.Service.Price ?? 0;
                    description = $"Thanh toán đặt lịch xét nghiệm - {testServiceRecord.FullNameOfMember} - TestServiceRecordID: {testServiceRecordId}";
                    status = testServiceRecord.Status;
                }
                else if (appointmentId.HasValue)
                {
                    var appointment = await _context.Appointments
                        .Include(a => a.Service)
                        .Include(a => a.Member)
                        .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

                    if (appointment == null || appointment.Service == null)
                        throw new ArgumentException("Lịch hẹn hoặc dịch vụ không tồn tại");

                    if (!appointment.Status.Trim().Equals(PAYMENT_PENDING_STATUS.Trim(), StringComparison.OrdinalIgnoreCase))
                    {
                        _logger.LogError($"Appointment Status không hợp lệ. Expected: '{PAYMENT_PENDING_STATUS.Trim()}', Actual: '{appointment.Status.Trim()}'");
                        throw new ArgumentException("Lịch hẹn không ở trạng thái chờ thanh toán.");
                    }

                    amount = appointment.Service.Price ?? 0;
                    description = $"Thanh toán đặt lịch tư vấn - {appointment.Member?.FullName} - AppointmentID: {appointmentId}";
                    status = appointment.Status;
                }
                else
                {
                    throw new ArgumentException("Phải cung cấp TestServiceRecordId hoặc AppointmentId");
                }


                var accessToken = await GetAccessTokenAsync();

                var request = new HttpRequestMessage(HttpMethod.Post, "/v2/checkout/orders")
                {
                    Headers = { Authorization = new AuthenticationHeaderValue("Bearer", accessToken) },
                    Content = new StringContent(JsonSerializer.Serialize(new
                    {
                        intent = "CAPTURE",
                        purchase_units = new[]
                        {
                            new
                            {
                                amount = new
                                {
                                    currency_code = "USD",
                                    value = (amount * (1 + taxRate)).ToString("F2")
                                },
                                description = description
                            }
                        },
                        application_context = new
                        {
                            return_url = $"{returnUrl}?handler=success&testServiceRecordId={testServiceRecordId}&appointmentId={appointmentId}",
                            cancel_url = returnUrl + "?handler=cancel"
                        }
                    }), Encoding.UTF8, "application/json")
                };

                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Lỗi khi tạo Order: {response.StatusCode} - {errorContent}");
                    throw new HttpRequestException($"Failed to create PayPal order: {response.StatusCode} - {errorContent}");
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var orderResponse = JsonSerializer.Deserialize<PayPalOrderResponseDTO>(content, options)
                    ?? throw new InvalidOperationException("Failed to deserialize PayPal order response.");
                var approvalLink = orderResponse.Links
                    .FirstOrDefault(link => link.Rel == "approve")?
                    .Href ?? throw new InvalidOperationException("Approval link not found in PayPal response.");

                return approvalLink;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi không xác định khi tạo URL thanh toán PayPal");
                throw;
            }
        }

        public async Task<string> ExecutePaymentAsync(string paymentId, string payerId, int? testServiceRecordId, int? appointmentId)
        {
            var accessToken = await GetAccessTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Post, $"/v2/checkout/orders/{paymentId}/capture")
            {
                Headers = { Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken) },
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var captureResponse = JsonSerializer.Deserialize<PayPalCaptureResponseDTO>(responseContent, options);
            string transactionId = captureResponse?.PurchaseUnits?.FirstOrDefault()?
                .Payments?.Captures?.FirstOrDefault()?.Id;

            decimal amount = 0;
            string description = "";

            if (testServiceRecordId.HasValue)
            {
                var testServiceRecord = await _context.TestServiceRecords
                    .Include(r => r.Service)
                    .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId);
                if (testServiceRecord != null)
                {
                    testServiceRecord.Status = "Dang cho kham";
                    amount = testServiceRecord.Service?.Price ?? 0;
                    description = $"Thanh toán xét nghiệm - {testServiceRecord.FullNameOfMember}";

                    await _context.SaveChangesAsync(); // Save status change first

                    // Assign staff after payment confirmation
                    await _testServiceRecordService.AssignStaffToTestRecordAsync(testServiceRecordId.Value);
                }


                if (testServiceRecord.MemberId.HasValue)
                {
                    var Notification = new Notification
                    {
                        UserId = testServiceRecord.MemberId.Value,
                        Title = "Thanh toán thành công",
                        Content = "Bạn đã thanh toán thành công đặt lịch xét nghiệm.",
                        SendTime = DateTime.UtcNow.AddHours(7),
                        IsRead = false
                    };

                    _context.Notifications.Add(Notification);
                    await _context.SaveChangesAsync();
                }
            }
            else if (appointmentId.HasValue)
            {
                var appointment = await _context.Appointments
                    .Include(a => a.Service)
                    .Include(a => a.Member)
                    .Include(a => a.Consultant)
                    .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
                if (appointment != null)
                {
                    appointment.Status = "Dang cho kham";
                    amount = appointment.Service?.Price ?? 0;
                    description = $"Thanh toán khám - {appointment.Member?.FullName}";

                    await _context.SaveChangesAsync();
                }

                if (appointment.MemberId != null)
                {
                    var paidAt = DateTime.UtcNow.AddHours(7).ToString("dd/MM/yyyy HH:mm");
                    var consultantName = appointment.Consultant?.FullName ?? "Không xác định";
                    var appointmentTime = appointment.StartTime?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa có lịch hẹn";

                    var content =
                        $@"Dịch vụ: {appointment.Service?.Name}
                        Bác sĩ tư vấn: {consultantName}
                        Ngày hẹn: {appointmentTime}
                        Thời gian thanh toán: {paidAt}
                        Số tiền: {amount:N0} VND
                        Mã giao dịch: {transactionId}";

                    var notification = new Notification
                    {
                        UserId = appointment.MemberId,
                        Title = "Thanh toán thành công lịch tư vấn",
                        Content = content,
                        SendTime = DateTime.UtcNow.AddHours(7),
                        IsRead = false
                    };

                    _context.Notifications.Add(notification);
                    await _context.SaveChangesAsync();
                }
            }

            
            decimal totalAmount = amount * (1 + taxRate);

            var invoice = new Invoice
            {
                TestServiceRecordId = testServiceRecordId,
                AppointmentId = appointmentId,
                TotalAmount = totalAmount,
                PaymentMethod = "PayPal",
                TransactionId = transactionId,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                PaidAt = DateTime.UtcNow.AddHours(7),
                UnitPrice = "VND",
                TaxRate = taxRate, 
                Status = 1
            };


            _context.Invoices.Add(invoice);

            await _context.SaveChangesAsync();

            return response.StatusCode.ToString();
        }
    }
}