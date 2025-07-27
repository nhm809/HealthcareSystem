using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthcareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class database : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleID = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoleDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__8AFACE3A872501E5", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Service",
                columns: table => new
                {
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Service__C51BB0EA63AB2E89", x => x.ServiceID);
                });

            migrationBuilder.CreateTable(
                name: "Specialty",
                columns: table => new
                {
                    SpecialtyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Specialt__D768F6489A0BBC10", x => x.SpecialtyID);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Provider = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GoogleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PasswordHash = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    DoB = table.Column<DateOnly>(type: "date", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreateDate = table.Column<DateOnly>(type: "date", nullable: true, defaultValueSql: "(getdate())"),
                    Avatar = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    RoleID = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__1788CCAC907AF080", x => x.UserID);
                    table.ForeignKey(
                        name: "FK__User__RoleID__286302EC",
                        column: x => x.RoleID,
                        principalTable: "Role",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "ReportServiceDetail",
                columns: table => new
                {
                    ReportServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportPeriod = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    UsageCount = table.Column<int>(type: "int", nullable: true),
                    AvgRating = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TotalRevenue = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ReportSe__EBE898635120F25D", x => x.ReportServiceID);
                    table.ForeignKey(
                        name: "FK__ReportSer__Servi__4222D4EF",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    AppointmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberID = table.Column<int>(type: "int", nullable: false),
                    MeetLink = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    ConsultantID = table.Column<int>(type: "int", nullable: true),
                    StartTime = table.Column<DateTime>(type: "datetime", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Symptoms = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Appointm__8ECDFCA2D172AD9E", x => x.AppointmentID);
                    table.ForeignKey(
                        name: "FK__Appointme__Consu__3F466844",
                        column: x => x.ConsultantID,
                        principalTable: "User",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Appointme__Membe__3D5E1FD2",
                        column: x => x.MemberID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Appointme__Servi__3E52440B",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    BlogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsultantID = table.Column<int>(type: "int", nullable: true),
                    PublishDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Topic = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Status = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Blog__54379E5044619794", x => x.BlogID);
                    table.ForeignKey(
                        name: "FK__Blog__Consultant__34C8D9D1",
                        column: x => x.ConsultantID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SendTime = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notifica__20CF2E325DAFA885", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK__Notificat__UserI__4BAC3F29",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "OTPRequest",
                columns: table => new
                {
                    OTPID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    ExpiredAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsVerified = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OTPReque__5C2EC562B070925E", x => x.OTPID);
                    table.ForeignKey(
                        name: "FK__OTPReques__UserI__48CFD27E",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    QuestionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberID = table.Column<int>(type: "int", nullable: true),
                    SpecialtyId = table.Column<int>(type: "int", nullable: true),
                    TitleQuestion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttachmentPath = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SubmitDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ConsultantID = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Age = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Heart = table.Column<bool>(type: "bit", nullable: true),
                    AnsCount = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__0DC06F8C7085B3FF", x => x.QuestionID);
                    table.ForeignKey(
                        name: "FK_Question_Specialty_SpecialtyId",
                        column: x => x.SpecialtyId,
                        principalTable: "Specialty",
                        principalColumn: "SpecialtyID");
                    table.ForeignKey(
                        name: "FK__Question__Consul__45F365D3",
                        column: x => x.ConsultantID,
                        principalTable: "User",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Question__Member__44FF419A",
                        column: x => x.MemberID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "ReproductiveCycle",
                columns: table => new
                {
                    CycleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberID = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CycleLength = table.Column<int>(type: "int", nullable: true),
                    PeriodLength = table.Column<int>(type: "int", nullable: true),
                    PillTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reproduc__077B24D97C9AA5A6", x => x.CycleID);
                    table.ForeignKey(
                        name: "FK__Reproduct__Membe__2F10007B",
                        column: x => x.MemberID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestServiceRecord",
                columns: table => new
                {
                    TestServiceRecordID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    Dob = table.Column<DateOnly>(type: "date", nullable: true),
                    Gender = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    PhoneNumber = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    FullNameOfMember = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MemberID = table.Column<int>(type: "int", nullable: true),
                    Result = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    RecordDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    TestDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TimeSlot = table.Column<TimeSpan>(type: "TIME", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestServ__F810175D4779B45B", x => x.TestServiceRecordID);
                    table.ForeignKey(
                        name: "FK__TestServi__Membe__398D8EEE",
                        column: x => x.MemberID,
                        principalTable: "User",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__TestServi__Servi__38996AB5",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID");
                    table.ForeignKey(
                        name: "FK__TestServi__Staff__3A81B327",
                        column: x => x.StaffID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "UserSpecialty",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false),
                    SpecialtyID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserSpec__8AFE43C8943BFACE", x => new { x.UserID, x.SpecialtyID });
                    table.ForeignKey(
                        name: "FK__UserSpeci__Speci__4F7CD00D",
                        column: x => x.SpecialtyID,
                        principalTable: "Specialty",
                        principalColumn: "SpecialtyID");
                    table.ForeignKey(
                        name: "FK__UserSpeci__UserI__4E88ABD4",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "WeeklyOverrideSchedules",
                columns: table => new
                {
                    WeeklyOverrideScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OverrideType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShiftType = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyOverrideSchedules", x => x.WeeklyOverrideScheduleId);
                    table.ForeignKey(
                        name: "FK_WeeklyOverrideSchedules_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeeklySchedules",
                columns: table => new
                {
                    WeeklyScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TIME", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TIME", nullable: false),
                    ShiftType = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklySchedules", x => x.WeeklyScheduleId);
                    table.ForeignKey(
                        name: "FK_WeeklySchedules_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogImage",
                columns: table => new
                {
                    ImageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlogID = table.Column<int>(type: "int", nullable: true),
                    ImagePath = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    ImageCaption = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UploadDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    OrderIndex = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogImag__7516F4EC111C0B4F", x => x.ImageID);
                    table.ForeignKey(
                        name: "FK__BlogImage__BlogI__59063A47",
                        column: x => x.BlogID,
                        principalTable: "Blog",
                        principalColumn: "BlogID");
                });

            migrationBuilder.CreateTable(
                name: "BlogView",
                columns: table => new
                {
                    BlogViewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberID = table.Column<int>(type: "int", nullable: true),
                    BlogID = table.Column<int>(type: "int", nullable: true),
                    ViewDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogView__5A5F0B6CFF67BCB5", x => x.BlogViewID);
                    table.ForeignKey(
                        name: "FK__BlogView__BlogID__5CD6CB2B",
                        column: x => x.BlogID,
                        principalTable: "Blog",
                        principalColumn: "BlogID");
                    table.ForeignKey(
                        name: "FK__BlogView__Member__5BE2A6F2",
                        column: x => x.MemberID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "QuestionThreadItem",
                columns: table => new
                {
                    ThreadItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionID = table.Column<int>(type: "int", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    AnsweredAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnswerText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttachmentPath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsAnswered = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__QuestionThreadItem", x => x.ThreadItemID);
                    table.ForeignKey(
                        name: "FK__QuestionThreadItem__Question",
                        column: x => x.QuestionID,
                        principalTable: "Question",
                        principalColumn: "QuestionID");
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    FeedbackID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentID = table.Column<int>(type: "int", nullable: true),
                    RecordID = table.Column<int>(type: "int", nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FeedbackDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__6A4BEDF62A9CAF58", x => x.FeedbackID);
                    table.ForeignKey(
                        name: "FK__Feedback__Appoin__656C112C",
                        column: x => x.AppointmentID,
                        principalTable: "Appointment",
                        principalColumn: "AppointmentID");
                    table.ForeignKey(
                        name: "FK__Feedback__Record__66603565",
                        column: x => x.RecordID,
                        principalTable: "TestServiceRecord",
                        principalColumn: "TestServiceRecordID");
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    InvoiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentID = table.Column<int>(type: "int", nullable: true),
                    TestServiceRecordID = table.Column<int>(type: "int", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    PaymentMethod = table.Column<string>(type: "varchar(50)", nullable: true),
                    TransactionId = table.Column<string>(type: "varchar(100)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    TaxRate = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    UnitPrice = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Invoice__D796AAD50B806764", x => x.InvoiceID);
                    table.ForeignKey(
                        name: "FK__Invoice__Appoint__5441852A",
                        column: x => x.AppointmentID,
                        principalTable: "Appointment",
                        principalColumn: "AppointmentID");
                    table.ForeignKey(
                        name: "FK__Invoice__TestSer__5535A963",
                        column: x => x.TestServiceRecordID,
                        principalTable: "TestServiceRecord",
                        principalColumn: "TestServiceRecordID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_ConsultantID",
                table: "Appointment",
                column: "ConsultantID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_MemberID",
                table: "Appointment",
                column: "MemberID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_ServiceID",
                table: "Appointment",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_ConsultantID",
                table: "Blog",
                column: "ConsultantID");

            migrationBuilder.CreateIndex(
                name: "IX_BlogImage_BlogID",
                table: "BlogImage",
                column: "BlogID");

            migrationBuilder.CreateIndex(
                name: "IX_BlogView_BlogID",
                table: "BlogView",
                column: "BlogID");

            migrationBuilder.CreateIndex(
                name: "IX_BlogView_MemberID",
                table: "BlogView",
                column: "MemberID");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_AppointmentID",
                table: "Feedback",
                column: "AppointmentID");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_RecordID",
                table: "Feedback",
                column: "RecordID");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_AppointmentID",
                table: "Invoice",
                column: "AppointmentID");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_TestServiceRecordID",
                table: "Invoice",
                column: "TestServiceRecordID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_UserID",
                table: "Notification",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_OTPRequest_UserID",
                table: "OTPRequest",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Question_ConsultantID",
                table: "Question",
                column: "ConsultantID");

            migrationBuilder.CreateIndex(
                name: "IX_Question_MemberID",
                table: "Question",
                column: "MemberID");

            migrationBuilder.CreateIndex(
                name: "IX_Question_SpecialtyId",
                table: "Question",
                column: "SpecialtyId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionThreadItem_QuestionID",
                table: "QuestionThreadItem",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_ReportServiceDetail_ServiceID",
                table: "ReportServiceDetail",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_ReproductiveCycle_MemberID",
                table: "ReproductiveCycle",
                column: "MemberID");

            migrationBuilder.CreateIndex(
                name: "IX_TestServiceRecord_MemberID",
                table: "TestServiceRecord",
                column: "MemberID");

            migrationBuilder.CreateIndex(
                name: "IX_TestServiceRecord_ServiceID",
                table: "TestServiceRecord",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_TestServiceRecord_StaffID",
                table: "TestServiceRecord",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleID",
                table: "User",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSpecialty_SpecialtyID",
                table: "UserSpecialty",
                column: "SpecialtyID");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyOverrideSchedules_UserId",
                table: "WeeklyOverrideSchedules",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklySchedules_UserId",
                table: "WeeklySchedules",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogImage");

            migrationBuilder.DropTable(
                name: "BlogView");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "OTPRequest");

            migrationBuilder.DropTable(
                name: "QuestionThreadItem");

            migrationBuilder.DropTable(
                name: "ReportServiceDetail");

            migrationBuilder.DropTable(
                name: "ReproductiveCycle");

            migrationBuilder.DropTable(
                name: "UserSpecialty");

            migrationBuilder.DropTable(
                name: "WeeklyOverrideSchedules");

            migrationBuilder.DropTable(
                name: "WeeklySchedules");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "TestServiceRecord");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropTable(
                name: "Service");

            migrationBuilder.DropTable(
                name: "Specialty");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
