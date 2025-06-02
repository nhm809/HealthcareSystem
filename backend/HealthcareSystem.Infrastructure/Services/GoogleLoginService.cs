
using Application.DTOs;
using Application.Interfaces;
using Infrastructure.data;


namespace Infrastructure.Services
{
    public class GoogleLoginService : IGoogleService
    {

        public async Task<GoogleLoginDTO> ValidateGoogleTokenAsync(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Authentication:Google:ClientId"] }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);

                return new GoogleLoginDTO
                {
                    Email = payload.Email,
                    Name = payload.Name,
                    Picture = payload.Picture
                };
            }
            catch
            {
                return null;
            }
        }

    }
}