using Application.Interfaces;
using Application.Validators;
using FluentValidation;
using HealthcareSystem.Application.Interfaces;
using HealthcareSystem.Infrastructure.Services;
using Infrastructure.data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging.Abstractions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

// Đăng ký các service
builder.Services.AddScoped<ITestServiceRecord, TestServiceRecordService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<INotiService, NotiService>();
builder.Services.AddScoped<IGoogleLoginService, GoogleLoginService>();
builder.Services.AddScoped<IService, ServiceService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPayPalService, PayPalService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IManageUserService, ManageUserService>();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();
builder.Services.AddLogging();

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Healthcare API", Version = "v1" });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
});

// add HttpClient to call PayPal payment API
builder.Services.AddHttpClient("PayPalClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["PayPal:BaseUrl"]);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
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

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();

app.Run();



// Thêm cấu hình PayPal
//builder.Services.AddSingleton(sp => new PayPalHttpClient.Environment(
//    builder.Configuration["PayPal:ClientId"],
//    builder.Configuration["PayPal:Secret"],
//    builder.Configuration["PayPal:Environment"] == "live"
//        ? PayPalHttpClient.Environment.Live(builder.Configuration["PayPal:BaseUrl"])
//        : PayPalHttpClient.Environment.Sandbox(builder.Configuration["PayPal:BaseUrl"])
//));

//builder.Services.AddHttpClient<PayPalHttpClient>();