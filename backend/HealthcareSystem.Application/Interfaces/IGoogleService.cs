
namespace Application.Interfaces
{
    using System.Threading.Tasks;
    using Application.DTOs;
    /// <summary>
    /// Interface for Google service.
    /// </summary>
    public interface IGoogleService
    {
        Task<GoogleLoginDTO> ValidateGoogleTokenAsync(string token);
    }
}