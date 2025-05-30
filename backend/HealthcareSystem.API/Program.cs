<<<<<<< HEAD
﻿using Infrastructure.data;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;
using Infrastructure.Services;
using Application.Validators;
using FluentValidation;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Healthcare API", Version = "v1" });
});
=======
using HealthcareSystem.Application.Interfaces;
using HealthcareSystem.Application.Services;
using HealthcareSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IHomeService, HomeService>();

>>>>>>> 451843ac7b64222dbb6a4cdff6f5aaba2014d4c6


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
