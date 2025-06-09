using System.Text.Json.Serialization;

namespace Application.DTOs
{
    public class PayPalOrderResponseDTO
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("status")]
        public string Status { get; set; }
        [JsonPropertyName("links")]
        public List<PayPalLinkDTO> Links { get; set; }
    }

    public class PayPalLinkDTO
    {
        [JsonPropertyName("href")]
        public string Href { get; set; }
        [JsonPropertyName("rel")]
        public string Rel { get; set; }
        [JsonPropertyName("method")]
        public string Method { get; set; }
    }

    public class PayPalTokenResponseDTO
    {
        public string scope { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string app_id { get; set; }
        public int expires_in { get; set; }
        public string nonce { get; set; }
    }

    public class PayPalCaptureResponseDTO
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("status")]
        public string Status { get; set; }
        [JsonPropertyName("purchase_units")]
        public List<PurchaseUnitDTO> PurchaseUnits { get; set; }
    }

    public class PurchaseUnitDTO
    {
        [JsonPropertyName("payments")]
        public PaymentsDTO Payments { get; set; }
    }

    public class PaymentsDTO
    {
        [JsonPropertyName("captures")]
        public List<CaptureDTO> Captures { get; set; }
    }

    public class CaptureDTO
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("status")]
        public string Status { get; set; }
    }
}