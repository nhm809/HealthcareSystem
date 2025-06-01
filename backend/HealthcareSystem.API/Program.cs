using Application.Interfaces;
using Application.Validators;
using FluentValidation;
using HealthcareSystem.Application.Interfaces;
using Infrastructure.data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
//using HealthcareSystem.Application.Interfaces;
//using Infrastructure.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container//////////////////
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
/////////////////////////////////////////////////

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();


builder.Services.AddScoped<IService, ServiceService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Healthcare API", Version = "v1" });
});


var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Healthcare API v1");
    });

}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers(); // quan trọng! Định tuyến đến các Controller

app.Run();