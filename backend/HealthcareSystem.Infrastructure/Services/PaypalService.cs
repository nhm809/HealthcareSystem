using Google;
using Google.Apis.Http;
using HealthcareSystem.Application.Interfaces;
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

namespace HealthcareSystem.Infrastructure.Services
{
    public class PayPalService : IPayPalService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly ILogger<PayPalService> _logger;

        public PayPalService(IConfiguration configuration, AppDbContext context, System.Net.Http.IHttpClientFactory httpClientFactory, ILogger<PayPalService> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _httpClient = httpClientFactory.CreateClient("PayPalClient");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        private async Task<string> GetAccessTokenAsync()
        {
            try
            {
                var clientId = _configuration["PayPal:ClientId"] ?? throw new ArgumentNullException("PayPal:ClientId is not configured.");
                var secret = _configuration["PayPal:Secret"] ?? throw new ArgumentNullException("PayPal:Secret is not configured.");
                var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secret}"));

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
                _logger.LogInformation($"Nhận Access Token thành công: {content}");
                var tokenResponse = JsonSerializer.Deserialize<PayPalTokenResponseDTO>(content) ?? throw new InvalidOperationException("Failed to deserialize PayPal token response.");
                return tokenResponse.access_token;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi không xác định khi lấy Access Token từ PayPal.");
                throw;
            }
        }

        
    public async Task<string> CreatePaymentUrlAsync(int testServiceRecordId, string returnUrl)
        {
            try
            {
                _logger.LogInformation($"Bắt đầu tạo URL thanh toán PayPal cho TestServiceRecordID: {testServiceRecordId}");

                var testServiceRecord = await _context.TestServiceRecords
                    .Include(r => r.Service)
                    .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId);

                if (testServiceRecord == null || testServiceRecord.Service == null)
                    throw new ArgumentException("Bản ghi hoặc dịch vụ không tồn tại");

                if (testServiceRecord.Status != "Ðang thanh toán")
                    throw new ArgumentException("Bản ghi không ở trạng thái chờ thanh toán.");

                decimal amount = testServiceRecord.Service.Price ?? 0;
                if (amount <= 0)
                    throw new ArgumentException("Giá tiền không hợp lệ.");

                _logger.LogInformation($"Thông tin bản ghi: ID={testServiceRecordId}, Status={testServiceRecord.Status}, Amount={amount}");

                var accessToken = await GetAccessTokenAsync();
                _logger.LogInformation($"Access Token: {accessToken}");
                //Tạo request để gửi lên PayPal (tạo order)
                var request = new HttpRequestMessage(HttpMethod.Post, "/v2/checkout/orders")
                {
                    Headers = { Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken) },
                    Content = new StringContent(JsonSerializer.Serialize(new
                    {
                        intent = "CAPTURE",
                        purchase_units = new[]
                        {
                        new
                        {
                            amount = new
                            {
                                currency_code = "USD",//đổi sang VND rồi mà PAypal không hỗ trợ VND
                                value = amount.ToString("F2")
                            },
                            description = $"Thanh toán đặt lịch xét nghiệm - {testServiceRecord.FullNameOfMember} - TestServiceRecordID: {testServiceRecordId}"
                        }
                    },
                        application_context = new
                        {
                            return_url = $"{returnUrl}?handler=success&testServiceRecordId={testServiceRecordId}",
                            cancel_url = returnUrl + "?handler=cancel"
                        }
                    }), Encoding.UTF8, "application/json")
                };

                _logger.LogInformation($"Gửi yêu cầu tạo Order tới PayPal: {await request.Content.ReadAsStringAsync()}");
                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Lỗi khi tạo Order: {response.StatusCode} - {errorContent}");
                    throw new HttpRequestException($"Failed to create PayPal order: {response.StatusCode} - {errorContent}");
                }

                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Nhận response từ PayPal: {content}");
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var orderResponse = JsonSerializer.Deserialize<PayPalOrderResponseDTO>(content, options)
                    ?? throw new InvalidOperationException("Failed to deserialize PayPal order response.");
                var approvalLink = orderResponse.Links
                    .FirstOrDefault(link => link.Rel == "approve")?
                    .Href ?? throw new InvalidOperationException("Approval link not found in PayPal response.");

                _logger.LogInformation($"Approval Link: {approvalLink}");
                return approvalLink;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi không xác định khi tạo URL thanh toán PayPal.");
                throw;
            }
        }

    public async Task<string> ExecutePaymentAsync(string paymentId, string payerId, int testServiceRecordId)
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
        // Deserialize để lấy transaction id (nếu có)
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var captureResponse = JsonSerializer.Deserialize<PayPalCaptureResponseDTO>(responseContent, options);
        string transactionId = captureResponse?.PurchaseUnits?.FirstOrDefault()?
            .Payments?.Captures?.FirstOrDefault()?.Id;

        // Cập nhật trạng thái trong DB
        var testServiceRecord = await _context.TestServiceRecords
            .Include(r => r.Service)
            .FirstOrDefaultAsync(r => r.TestServiceRecordId == testServiceRecordId);
        if (testServiceRecord != null)
        {
            testServiceRecord.Status = "Đang cho kham";
        }

        // Tạo mới Invoice
        var invoice = new Invoice
        {
            TestServiceRecordId = testServiceRecordId,
            TotalAmount = testServiceRecord?.Service?.Price ?? 0,
            PaymentMethod = "PayPal",
            TransactionId = transactionId,
            CreatedAt = DateTime.UtcNow,
            PaidAt = DateTime.UtcNow,
            UnitPrice = "VND",//Check
            TaxRate = (testServiceRecord?.Service?.Price ?? 0) * 0.05m, 
            Status = 1 
        };
        _context.Invoices.Add(invoice);

        await _context.SaveChangesAsync();

        return response.StatusCode.ToString();
    }
    }
}