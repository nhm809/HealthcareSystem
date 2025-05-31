--Create database HealthcareSystem
--go

use HealthcareSystem

CREATE TABLE [User] (
  [UserID] int PRIMARY KEY,
  [FullName] nvarchar(50),
  [PasswordHash] varchar(100),
  [Email] varchar(100),
  [PhoneNumber] varchar(15),
  [DoB] date,
  [Gender] nvarchar(15),
  [Address] nvarchar(100),
  [CreateDate] date,
  [Avatar] varchar(200)
)
GO

CREATE TABLE [Appointment] (
  [AppointmentID] int PRIMARY KEY,
  [MemberID] int,
  [MeetLink] varchar(50),
  [ServiceID] int,
  [ConsultantID] int,
  [StartTime] datetime,
  [EndTime] datetime,
  [Status] varchar(20)
)
GO

CREATE TABLE [Service] (
  [ServiceID] int PRIMARY KEY,
  [Name] nvarchar(100),
  [Description] text,
  [Price] decimal(10,2)
)
GO

CREATE TABLE [Feedback] (
  [FeedbackID] int PRIMARY KEY,
  [AppointmentID] int,
  [RecordID] int,
  [Rating] int,
  [Comment] text,
  [FeedbackDate] date
)
GO

CREATE TABLE [ReproductiveCycle] (
  [CycleID] int PRIMARY KEY,
  [MemberID] int,
  [StartDate] date,
  [CycleLength] int,
  [PeriodLength] int,
  [PillTime] time,
  [LastUpdated] datetime
)
GO

CREATE TABLE [Blog] (
  [BlogID] int PRIMARY KEY,
  [Title] nvarchar(200),
  [Content] text,
  [Description] text,
  [ConsultantID] int,
  [PublishDate] date,
  [Topic] varchar(50)
)
GO

CREATE TABLE [TestServiceRecord] (
  [TestServiceRecordID] int PRIMARY KEY,
  [ServiceID] int,
  [DoB] date,
  [Gender] nvarchar(15),
  [PhoneNumber] varchar(15),
  [FullNameOfMember] nvarchar(100),
  [MemberID] int,
  [Result] text,
  [StaffID] int,
  [RecordDate] datetime,
  [Notes] text,
  [Status] varchar(20)
)
GO

CREATE TABLE [Notification] (
  [NotificationID] int PRIMARY KEY,
  [UserID] int,
  [Type] nvarchar(50),
  [Content] text,
  [SendTime] datetime,
  [Status] varchar(20)
)
GO

CREATE TABLE [WorkSchedule] (
  [WorkScheduleID] int PRIMARY KEY,
  [ConsultantID] int,
  [WorkDate] date,
  [StartTime] time,
  [EndTime] time,
  [ShiftType] nvarchar(50),
  [Note] nvarchar(100)
)
GO

CREATE TABLE [BlogImage] (
  [ImageID] int PRIMARY KEY,
  [BlogID] int,
  [ImagePath] varchar(200),
  [ImageCaption] varchar(200),
  [UploadDate] datetime,
  [OrderIndex] int
)
GO

CREATE TABLE [Payment] (
  [paymentID] int PRIMARY KEY,
  [PaymentMethod] nvarchar(50),
  [TransactionID] varchar(100),
  [Amount] decimal(10,2),
  [BankCode] varchar(20),
  [PaidAt] datetime,
  [Status] varchar(20)
)
GO

CREATE TABLE [ReportServiceDetail] (
  [ReportServiceID] int PRIMARY KEY,
  [ReportPeriod] nvarchar(20),
  [ServiceID] int,
  [UsageCount] int,
  [AvgRating] decimal(10,2),
  [TotalRevenue] decimal(10,2),
  [CreatedAt] datetime
)
GO

CREATE TABLE [Question] (
  [QuestionID] int PRIMARY KEY,
  [MemberID] int,
  [Specialty] nvarchar(50),
  [TitleQuestion] nvarchar(200),
  [Content] text,
  [AttachmentPath] nvarchar(200),
  [SubmitDate] datetime,
  [ConsultantID] int,
  [Status] nvarchar(20)
)
GO

CREATE TABLE [Invoice] (
  [InvoiceID] int PRIMARY KEY,
  [AppointmentID] int,
  [TestServiceRecordID] int,
  [TotalAmount] decimal,
  [CreatedAt] datetime,
  [PaymentID] int,
  [Status] int,
  [TaxRate] decimal(10,2),
  [UnitPrice] nvarchar(15)
)
GO

CREATE TABLE [OTPRequest] (
  [OTPID] int PRIMARY KEY,
  [UserID] int,
  [Code] varchar(15),
  [Email] varchar(100),
  [CreatedAt] datetime,
  [ExpiredAt] datetime,
  [IsVerified] int
)
GO

CREATE TABLE [Message] (
  [MessageID] int PRIMARY KEY,
  [QuestionID] int,
  [Content] text,
  [SenderID] int,
  [SentAt] datetime
)
GO

CREATE TABLE [Specialty] (
  [SpecialtyID] int PRIMARY KEY,
  [Name] nvarchar(15),
  [Description] text
)
GO

CREATE TABLE [Role] (
  [RoleID] varchar(20) PRIMARY KEY,
  [UserID] int,
  [RoleName] nvarchar(100)
)
GO

CREATE TABLE [UserSpecialty] (
  [UserID] int,
  [SpecialtyID] int,
  PRIMARY KEY ([UserID], [SpecialtyID])
)
GO

CREATE TABLE [BlogView] (
  [BlogViewID] int PRIMARY KEY,
  [MemberID] int,
  [BlogID] int,
  [ViewDate] datetime
)
GO

ALTER TABLE [Appointment] ADD FOREIGN KEY ([MemberID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Appointment] ADD FOREIGN KEY ([ServiceID]) REFERENCES [Service] ([ServiceID])
GO

ALTER TABLE [Appointment] ADD FOREIGN KEY ([ConsultantID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Feedback] ADD FOREIGN KEY ([AppointmentID]) REFERENCES [Appointment] ([AppointmentID])
GO

ALTER TABLE [Feedback] ADD FOREIGN KEY ([RecordID]) REFERENCES [TestServiceRecord] ([TestServiceRecordID])
GO

ALTER TABLE [ReproductiveCycle] ADD FOREIGN KEY ([MemberID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Blog] ADD FOREIGN KEY ([ConsultantID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [TestServiceRecord] ADD FOREIGN KEY ([ServiceID]) REFERENCES [Service] ([ServiceID])
GO

ALTER TABLE [TestServiceRecord] ADD FOREIGN KEY ([MemberID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [TestServiceRecord] ADD FOREIGN KEY ([StaffID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Notification] ADD FOREIGN KEY ([UserID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [WorkSchedule] ADD FOREIGN KEY ([ConsultantID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [BlogImage] ADD FOREIGN KEY ([BlogID]) REFERENCES [Blog] ([BlogID])
GO

ALTER TABLE [Payment] ADD FOREIGN KEY ([paymentID]) REFERENCES [Invoice] ([InvoiceID])
GO

ALTER TABLE [ReportServiceDetail] ADD FOREIGN KEY ([ServiceID]) REFERENCES [Service] ([ServiceID])
GO

ALTER TABLE [Question] ADD FOREIGN KEY ([MemberID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Question] ADD FOREIGN KEY ([ConsultantID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Invoice] ADD FOREIGN KEY ([AppointmentID]) REFERENCES [Appointment] ([AppointmentID])
GO

ALTER TABLE [Invoice] ADD FOREIGN KEY ([TestServiceRecordID]) REFERENCES [TestServiceRecord] ([TestServiceRecordID])
GO

ALTER TABLE [OTPRequest] ADD FOREIGN KEY ([UserID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Message] ADD FOREIGN KEY ([QuestionID]) REFERENCES [Question] ([QuestionID])
GO

ALTER TABLE [Message] ADD FOREIGN KEY ([SenderID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [Role] ADD FOREIGN KEY ([UserID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [UserSpecialty] ADD FOREIGN KEY ([UserID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [UserSpecialty] ADD FOREIGN KEY ([SpecialtyID]) REFERENCES [Specialty] ([SpecialtyID])
GO

ALTER TABLE [BlogView] ADD FOREIGN KEY ([MemberID]) REFERENCES [User] ([UserID])
GO

ALTER TABLE [BlogView] ADD FOREIGN KEY ([BlogID]) REFERENCES [Blog] ([BlogID])
GO



--User
INSERT INTO [User] (UserID, FullName, PasswordHash, Email, PhoneNumber, DoB, Gender, Address, CreateDate, Avatar)
VALUES
(1, N'Nguyễn Hữu Mỹ', '$2b$12$s2EQOrLdHUPEcD9BiXsgq.G6aZLcwFOyW61e8dN6/wt.ZIdWSrXqS', 'mexnguyen894@gmail.com', '0987654321', '2004-08-08', 'Male', N'123 Lê Lợi, Quận 1, TP.HCM', GETDATE(), NULL),
(2, N'Tống Anh Tài', '$2b$12$OXdZxnmSDIqmCC0sFpZ5T.8i6RF648Ipf6csdtQdqqxdi7QKHNBL2', 'taitongngocanh@gmail.com', '0912345678', '2004-05-10', 'Male', N'45 Nguyễn Huệ, TP Biên Hòa, Đồng Nai', GETDATE(), NULL),
(3, N'Phạm Nguyễn Đăng Hải', '$2b$12$TSpG3SIAuXJ6pBoaBJpCK.cdH6c2GSUq3YKT9c6e4MHuZT7Y2tUvC', 'danghai@gmail.com', '0938123456', '2004-01-01', 'Male', N'78 Trần Phú, TP Huế, Thừa Thiên Huế', GETDATE(), NULL),
(4, N'Nguyễn Văn Hiếu', '$2b$12$2deAPorkgcO3QueTGeeegu97aro/MFXcBxWUWOFjk/AyWl6wfc/.i', 'hieubmk2210@gmail.com', '0966778899', '2003-01-18', 'Male', N'56 Hai Bà Trưng, TP Nam Định, Nam Định', GETDATE(), NULL),
(5, N'Nguyễn Trọng Tốt', '$2b$12$UMAdJnd3hmURUOSale0zK.Yysc/4WcsHQai4lRxwiMWgqs.xFMtb.', 'totn786@gmail.com', '0977665544', '2004-11-05', 'Male', N'90 Lý Thường Kiệt, TP Vinh, Nghệ An', GETDATE(), NULL);

--Role 
INSERT INTO Role (RoleID, UserID, RoleName)
VALUES
('AD', 1, 'Admin'),
('MG', 2, 'Manager'),
('ST', 3, 'Staff'),
('CS', 4, 'Consultant'),
('MB', 5, 'Member');