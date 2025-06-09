using Application.DTOs;
using System;

namespace HealthcareSystem.Application.Interfaces
{
    public interface IPayPalService
    {
        Task<string> CreatePaymentUrlAsync(int testServiceRecordId, string returnUrl);
        Task<string> ExecutePaymentAsync(string paymentId, string payerId, int testServiceRecordId);
    }
}