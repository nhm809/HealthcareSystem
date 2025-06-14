--create database HealthcareSystemDb
--go
--Bản đã sửa 31/5/2025
CREATE TABLE [Role] (
  [RoleID] varchar(20) PRIMARY KEY,
  [RoleName] nvarchar(100) NOT NULL,
  [RoleDescription] nvarchar(255) NULL -- hoặc NOT NULL tùy nhu cầu
)




-- 1. User
CREATE TABLE [User] (
  [UserID] int PRIMARY KEY Identity(1,1),
  [FullName] nvarchar(50),
  [Provider] nvarchar(50),
  [GoogleID] nvarchar(100), 
  [PasswordHash] varchar(100) NOT NULL,
  [Email] varchar(100) NOT NULL,
  [PhoneNumber] varchar(15),
  [DoB] date,
  [Gender] nvarchar(15) CHECK (Gender IN ('Male', 'Female', 'Other')),
  [Address] nvarchar(100),
  [CreateDate] date DEFAULT GETDATE(),
  [Avatar] varchar(200),
  [RoleID] varchar(20), -- Khóa ngoại đến bảng Role
  FOREIGN KEY ([RoleID]) REFERENCES [Role]([RoleID])
)
GO
-- 2. Service
CREATE TABLE Service (
    ServiceID INT PRIMARY KEY Identity(1,1),
    Name NVARCHAR(100),
    Description NVARCHAR(MAX),
    Price DECIMAL(10,2)
);


-- 3. Specialty
CREATE TABLE Specialty (
    SpecialtyID INT PRIMARY KEY  Identity(1,1),
    [Name] NVARCHAR(50),
    [Description] NVARCHAR(MAX)
);

-- 5. ReproductiveCycle
CREATE TABLE ReproductiveCycle (
    CycleID INT PRIMARY KEY Identity(1,1),
    MemberID INT,
    StartDate DATE,
    CycleLength INT,
    PeriodLength INT,
    PillTime TIME,
    LastUpdated DATETIME,
    FOREIGN KEY (MemberID) REFERENCES [User](UserID)
);




-- 6. WorkSchedule
CREATE TABLE WorkSchedule (
    WorkScheduleID INT PRIMARY KEY Identity(1,1),
    ConsultantID INT ,
    WorkDate DATE,
    StartTime TIME,
    EndTime TIME,
    ShiftType NVARCHAR(50),
    Note NVARCHAR(100),
    FOREIGN KEY (ConsultantID) REFERENCES [User](UserID)
);


-- 7. Blog
CREATE TABLE Blog (
    BlogID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200),
    Content NVARCHAR(MAX),
    [Description] NVARCHAR(MAX),
    ConsultantID INT,
    PublishDate DATE,
    Topic NVARCHAR(50),
    FOREIGN KEY (ConsultantID) REFERENCES [User](UserID)
);

-- 8. TestServiceRecord
CREATE TABLE TestServiceRecord (
    TestServiceRecordID INT PRIMARY KEY Identity(1,1),
    ServiceID INT,
    Dob DATE,
    Gender VARCHAR(15) CHECK (Gender IN ('Male', 'Female', 'Other')),
    PhoneNumber VARCHAR(15),
    FullNameOfMember NVARCHAR(100),
    MemberID INT,
    Result NVARCHAR(100),
    StaffID INT,
    RecordDate DATETIME,
    Notes NVARCHAR(100),
    Status VARCHAR(20),
    FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID),
    FOREIGN KEY (MemberID) REFERENCES [User](UserID),
    FOREIGN KEY (StaffID) REFERENCES [User](UserID)
);

-- 9. Appointment
CREATE TABLE Appointment (
    AppointmentID INT PRIMARY KEY Identity(1,1),
    MemberID INT,
    MeetLink VARCHAR(50),
    ServiceID INT,
    ConsultantID INT,
    StartTime DATETIME,
    EndTime DATETIME,
    Status NVARCHAR(20),
    FOREIGN KEY (MemberID) REFERENCES [User](UserID),
    FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID),
    FOREIGN KEY (ConsultantID) REFERENCES [User](UserID)
);

-- 10. ReportServiceDetail
CREATE TABLE ReportServiceDetail (
    ReportServiceID INT PRIMARY KEY Identity(1,1) ,
    ReportPeriod NVARCHAR(20),
    ServiceID INT,
    UsageCount INT,
    AvgRating DECIMAL(10,2),
    TotalRevenue DECIMAL(10,2),
    CreatedAt DATETIME,
    FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID)
);

-- 11. Question
CREATE TABLE Question (
    QuestionID INT PRIMARY KEY Identity(1,1),
    MemberID INT,
    Specialty NVARCHAR(50),
    TitleQuestion NVARCHAR(200),
    Content NVARCHAR(MAX),
    AttachmentPath NVARCHAR(200),
    SubmitDate DATETIME,
    ConsultantID INT,
    [Status] NVARCHAR(20),
    FOREIGN KEY (MemberID) REFERENCES [User](UserID),
    FOREIGN KEY (ConsultantID) REFERENCES [User](UserID)
);


-- 12. OTPRequest
CREATE TABLE OTPRequest (
    OTPID INT PRIMARY KEY Identity(1,1),
    UserID INT,
    Code VARCHAR(15),
    Email VARCHAR(100),
    CreatedAt DATETIME,
    ExpiredAt DATETIME,
    IsVerified INT,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- 13. Notification
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY Identity(1,1),
    UserID INT,
    [Type] NVARCHAR(50),
    Content TEXT,
    SendTime DATETIME,
    [Status] NVARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- 14. UserSpecialty
CREATE TABLE UserSpecialty (
    UserID INT ,
    SpecialtyID INT ,
    PRIMARY KEY (UserID, SpecialtyID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (SpecialtyID) REFERENCES Specialty(SpecialtyID)
);


-- 15. Payment - not yet
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY Identity(1,1),
    PaymentMethod NVARCHAR(50),
    TransactionID VARCHAR(100),
    Amount DECIMAL(10,2),
    BankCode VARCHAR(20),
    PaidAt DATETIME,
    Status VARCHAR(20)
);


-- 16. Invoice
CREATE TABLE Invoice (
    InvoiceID INT PRIMARY KEY Identity(1,1),
    AppointmentID INT NULL,
    TestServiceRecordID INT NULL,
    TotalAmount DECIMAL(10,2),
    CreatedAt DATETIME,
    PaymentID INT NULL,
    [Status] INT,
    TaxRate DECIMAL(10,2),
    UnitPrice VARCHAR(15),
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    FOREIGN KEY (TestServiceRecordID) REFERENCES TestServiceRecord(TestServiceRecordID),
	FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID)
);

-- 17. BlogImage
CREATE TABLE BlogImage (
    ImageID INT PRIMARY KEY Identity(1,1),
    BlogID INT,
    ImagePath VARCHAR(200),
    ImageCaption NVARCHAR(200),
    UploadDate DATETIME,
    OrderIndex INT,
    FOREIGN KEY (BlogID) REFERENCES Blog(BlogID)
);

-- 18. BlogView
CREATE TABLE BlogView (
    BlogViewID INT PRIMARY KEY Identity(1,1),
    MemberID INT,
    BlogID INT,
    ViewDate DATETIME,
    FOREIGN KEY (MemberID) REFERENCES [User](UserID),
    FOREIGN KEY (BlogID) REFERENCES Blog(BlogID)
);




-- 19. Message
CREATE TABLE Message (
    MessageID INT PRIMARY KEY Identity(1,1),
    QuestionID INT,
    Content  NVARCHAR(MAX),
    SenderID INT,
    SentAt DATETIME,
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID),
    FOREIGN KEY (SenderID) REFERENCES [User](UserID)
);

-- 20. Feedback
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    AppointmentID INT NULL,
    RecordID INT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(MAX),
    FeedbackDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    FOREIGN KEY (RecordID) REFERENCES TestServiceRecord(TestServiceRecordID)
);
--===========================================================================================================
--Insert data



--Role --=====================================================================================================================================================
INSERT INTO [Role] ([RoleID], [RoleName], [RoleDescription]) VALUES
('AD', 'Admin', N'Quản trị viên toàn hệ thống'),
('MG', 'Manager', N'Quản lý người dùng và dịch vụ'),
('ST', 'Staff', N'Bác sĩ/tư vấn viên thực hiện chẩn đoán'),
('CS', 'Consultant', N'Nhân viên tư vấn'),  --
('MB', 'Member', N'Thành viên/khách hàng sử dụng dịch vụ');

--User
INSERT INTO [User] (FullName, [Provider], GoogleId, [PasswordHash], Email, PhoneNumber, DoB, Gender, Address, CreateDate, Avatar, RoleID,[RefreshToken],[RefreshTokenExpiryTime],[IsActive])
VALUES
(N'Nguyễn Hữu Mỹ', 'Local', '','$2b$12$s2EQOrLdHUPEcD9BiXsgq.G6aZLcwFOyW61e8dN6/wt.ZIdWSrXqS', 'mexnguyen894@gmail.com', '0987654321', '2004-08-08', 'Male', N'123 Lê Lợi, Quận 1, TP.HCM', GETDATE(), NULL, 'AD',NULL,NULL,0),
(N'Tống Anh Tài', 'Local', '', '$2b$12$OXdZxnmSDIqmCC0sFpZ5T.8i6RF648Ipf6csdtQdqqxdi7QKHNBL2', 'taitongngocanh@gmail.com', '0912345678', '2004-05-10', 'Male', N'45 Nguyễn Huệ, TP Biên Hòa, Đồng Nai', GETDATE(), NULL, 'MG',NULL,NULL,0),
(N'Phạm Nguyễn Đăng Hải', 'Local', '', '$2b$12$TSpG3SIAuXJ6pBoaBJpCK.cdH6c2GSUq3YKT9c6e4MHuZT7Y2tUvC', 'danghai@gmail.com', '0938123456', '2004-01-01', 'Male', N'78 Trần Phú, TP Huế, Thừa Thiên Huế', GETDATE(), NULL, 'ST',NULL,NULL,0),
(N'Nguyễn Văn Hiếu', 'Local', '', '$2b$12$2deAPorkgcO3QueTGeeegu97aro/MFXcBxWUWOFjk/AyWl6wfc/.i', 'hieubmk2210@gmail.com', '0966778899', '2003-01-18', 'Male', N'56 Hai Bà Trưng, TP Nam Định, Nam Định', GETDATE(), NULL, 'CS',NULL,NULL,0),
(N'Nguyễn Trọng Tốt', 'Local', '', '$2b$12$UMAdJnd3hmURUOSale0zK.Yysc/4WcsHQai4lRxwiMWgqs.xFMtb.', 'totn786@gmail.com', '0977665544', '2004-11-05', 'Male', N'90 Lý Thường Kiệt, TP Vinh, Nghệ An', GETDATE(), NULL, 'MB',NULL,NULL,0);


--Specialty--=====================================================================================================================================================
INSERT INTO Specialty ([Name], [Description]) VALUES
(N'Sản Phụ Khoa', N'Tư vấn và điều trị các vấn đề liên quan đến chu kỳ kinh nguyệt, sinh sản, viêm nhiễm phụ khoa, kế hoạch hóa gia đình, và sức khỏe sinh sản nữ.'),
(N'Nam Khoa', N'Tư vấn và điều trị các vấn đề sinh lý nam, rối loạn cương dương, sức khỏe tinh trùng, bệnh lý tiết niệu nam.'),
(N'Da liễu - STIs', N'Chẩn đoán và điều trị các bệnh lây truyền qua đường tình dục như HIV, giang mai, lậu, sùi mào gà,... và tư vấn phòng tránh.'),
(N'Tâm lý học', N'Tư vấn các vấn đề tâm lý liên quan đến giới tính, bản dạng giới, rối loạn lo âu, trầm cảm, và hỗ trợ cho nhóm LGBTQ+.'),
(N'Y học tổng quát', N'Đánh giá tổng quát sức khỏe, tư vấn điều trị các bệnh nền ảnh hưởng đến sinh sản, kê đơn thuốc cơ bản.'),
(N'Dược học', N'Tư vấn sử dụng thuốc tránh thai, thuốc điều trị STIs, giải thích tác dụng phụ và tương tác thuốc.'),
(N'Giáo dục giới tính', N'Cung cấp kiến thức về sức khỏe giới tính, tình dục an toàn và nâng cao nhận thức cộng đồng.'),
(N'Xét nghiệm y khoa', N'Thực hiện và phân tích các xét nghiệm STIs, hỗ trợ quản lý quy trình xét nghiệm và trả kết quả.');


--Service--=====================================================================================================================================================
INSERT INTO Service ( Name, Description, Price)
VALUES
(N'Xét nghiệm tổng quát STIs', N'Kiểm tra tổng quát các bệnh lây truyền qua đường tình dục ,Xét nghiệm theo quá trình', 1000000),
(N'Tư vấn sức khỏe sinh sản', N'Tư vấn 1:1 với chuyên gia về sức khỏe sinh sản.', 150000)


--[UserSpecialty]--=====================================================================================================================================================
INSERT INTO [dbo].[UserSpecialty] (UserID, SpecialtyID)
VALUES
(3, 1), -- Sản Phụ Khoa
(3, 2), -- Nam Khoa
(3, 4); -- Tâm lý học


--Appointment--=====================================================================================================================================================
--UserID 5 là Member (người đặt lịch) và UserID 4 là Consultant
--INSERT INTO Appointment (MemberID, MeetLink, ServiceID, ConsultantID, StartTime, EndTime, Status)
--VALUES
--(5, 'https://meet.link/1', 2, 4, '2025-06-03 08:00:00', '2025-06-03 08:30:00', N'Đã đặt'),
--(5, 'https://meet.link/2', 1, 4, '2025-06-03 14:00:00', '2025-06-03 14:45:00', N'Đã đặt');



--TestServiceRecord --=====================================================================================================================================================
-- Dữ liệu TestServiceRecord cho các dịch vụ tương ứng với AppointmentID 2 và 3
--INSERT INTO TestServiceRecord (
--    ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember,
--    MemberID, Result, StaffID, RecordDate, Notes, Status
--)
--VALUES
---- Cho AppointmentID 2 (ServiceID = 2)
--(2, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 
-- 5, N'Không phát hiện vấn đề gì', 4, '2025-06-03 09:00:00', N'Xét nghiệm OK', N'Đã hoàn thành'),

---- Cho AppointmentID 3 (ServiceID = 1)
--(1, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 
-- 5, N'Dương tính nhẹ, cần theo dõi', 4, '2025-06-03 15:00:00', N'Cần tư vấn thêm', N'Đã hoàn thành');


--Question --=====================================================================================================================================================
--INSERT INTO Question (
--    MemberID, Specialty, TitleQuestion, Content, AttachmentPath, SubmitDate, ConsultantID, [Status]
--)
--VALUES
--(
--    5,
--    N'Sản phụ khoa',
--    N'Trễ kinh 7 ngày có phải mang thai không?',
--    N'Chào bác sĩ, em bị trễ kinh 7 ngày, kèm đau bụng dưới và tức ngực. Không biết có nên thử thai chưa ạ?',
--    NULL,
--    '2024-05-01 09:15:00',
--    4,
--    N'Đã trả lời'
--);

--=====================================================================================================================================================
-- Message trao đổi giữa thành viên và tư vấn viên
-- Tin nhắn giữa Member (UserID = 5) và Consultant (UserID = 4) liên quan đến QuestionID = 1
--INSERT INTO Message (QuestionID, Content, SenderID, SentAt)
--VALUES
--(1, N'Chào bác sĩ, em bị trễ kinh 7 ngày, kèm đau bụng dưới và tức ngực. Không biết có nên thử thai chưa ạ?', 5, '2024-05-01 09:15:00'),
--(1, N'Chào bạn, các dấu hiệu bạn mô tả rất có thể là dấu hiệu mang thai. Bạn nên thử thai bằng que thử tại nhà để xác định nhé.', 4, '2024-05-01 09:30:00'),
--(1, N'Em nên thử vào buổi sáng hay bất kỳ lúc nào cũng được ạ?', 5, '2024-05-01 09:35:00'),
--(1, N'Tốt nhất là nên thử vào buổi sáng sớm sau khi thức dậy, vì lúc đó nồng độ HCG trong nước tiểu cao nhất.', 4, '2024-05-01 09:40:00');



---Blog-=====================================================================================================================================================
INSERT INTO Blog (Title, Content, [Description], ConsultantID, PublishDate, Topic)
VALUES 
-- Bài 1
(N'Cách theo dõi chu kỳ kinh nguyệt và nhận biết thời gian rụng trứng',
 N'Nắm rõ chu kỳ kinh nguyệt giúp bạn dự đoán thời gian rụng trứng và khả năng mang thai. Trong bài viết này, chúng tôi hướng dẫn bạn cách theo dõi và sử dụng công cụ tính chu kỳ hiệu quả.',
 N'Hướng dẫn theo dõi chu kỳ kinh nguyệt để nhận biết thời điểm rụng trứng và tránh thai tự nhiên.',
 4, '2025-05-20', N'Sức khỏe'),

-- Bài 2
(N'Những điều cần biết về các bệnh lây truyền qua đường tình dục (STIs)',
 N'STIs là các bệnh nguy hiểm có thể ảnh hưởng đến sức khỏe sinh sản và cuộc sống tình dục. Bài viết giúp bạn hiểu rõ về dấu hiệu, cách phòng ngừa và thời điểm cần xét nghiệm.',
 N'Hiểu đúng về STIs – dấu hiệu, cách lây và phòng ngừa hiệu quả.',
 4, '2025-05-18', N'STIs'),

-- Bài 3
(N'Thuốc tránh thai: Cách dùng đúng và những lưu ý quan trọng',
 N'Không chỉ uống đúng giờ, người dùng thuốc tránh thai còn cần lưu ý nhiều điều khác để đảm bảo hiệu quả tránh thai. Bài viết giải đáp chi tiết những thắc mắc thường gặp.',
 N'Giải đáp mọi thắc mắc về việc sử dụng thuốc tránh thai an toàn và hiệu quả.',
 4, '2025-05-15', N'Sức khỏe'),

-- Bài 4
(N'Lần đầu đi xét nghiệm STIs – Cần chuẩn bị gì?',
 N'Nhiều người lo lắng hoặc ngại ngùng khi đi xét nghiệm STIs. Bài viết chia sẻ quy trình, những điều cần chuẩn bị và cách lấy kết quả an toàn, bảo mật.',
 N'Chuẩn bị tâm lý và hiểu quy trình khi đi xét nghiệm STIs lần đầu.',
 4, '2025-05-12', N'Hướng dẫn'),

-- Bài 5
(N'Tư vấn giới tính online – Giải pháp an toàn và tiện lợi cho giới trẻ',
 N'Tư vấn giới tính trực tuyến giúp bạn giải đáp những thắc mắc nhạy cảm một cách kín đáo và nhanh chóng. Hãy tìm hiểu cách đặt lịch và trao đổi hiệu quả với chuyên gia.',
 N'Tìm hiểu cách tư vấn giới tính online và những lợi ích mang lại.',
 4, '2025-05-10', N'Tâm lý');



 --Blogimage-=====================================================================================================================================================
 INSERT INTO BlogImage (BlogID, ImagePath, ImageCaption, UploadDate, OrderIndex)
VALUES 
(1, '/images/blogs/cycle-tracking.jpg', N'Minh họa chu kỳ kinh nguyệt', GETDATE(), 1),
(2, '/images/blogs/stis-awareness.jpg', N'Thông tin về các bệnh STIs', GETDATE(), 1),
(3, '/images/blogs/birth-control-pills.jpg', N'Thuốc tránh thai hàng ngày', GETDATE(), 1),
(4, '/images/blogs/stis-test.jpg', N'Tư thế lấy mẫu xét nghiệm STIs', GETDATE(), 1),
(5, '/images/blogs/online-consultation.jpg', N'Tư vấn giới tính trực tuyến', GETDATE(), 1);


--Blogview -=====================================================================================================================================================
INSERT INTO BlogView (MemberID, BlogID, ViewDate)
VALUES 
(5, 1, GETDATE()),
(5, 2, GETDATE()),
(5, 3, GETDATE());


--TestServiceRecord -=====================================================================================================================================================
--dữ liệu mới cho MemberID = 5 (Nguyễn Trọng Tốt)
--INSERT INTO TestServiceRecord (
--    ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember, MemberID, Result, StaffID, RecordDate, Notes, Status
--)
--VALUES
---- Tư vấn sức khỏe sinh sản
--(2, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Không phát hiện vấn đề gì', 3, '2025-06-03 09:00:00', N'Xét nghiệm OK', N'Đã hoàn thành'),

---- Xét nghiệm HIV
--(1, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Dương tính nhẹ, cần theo dõi', 3, '2025-06-03 15:00:00', N'Cần tư vấn thêm', N'Đã hoàn thành'),

---- Xét nghiệm HIV lần 2
--(1, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Âm tính với HIV', 3, '2025-05-05 08:00:00', N'Tầm soát định kỳ', N'Đã hoàn thành'),

---- Tư vấn sinh sản lần 2
--(2, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Tư vấn hoàn tất. Không có dấu hiệu bất thường.', 3, '2025-05-08 09:00:00', N'Quan tâm kế hoạch sinh con', N'Đã hoàn thành'),

---- Xét nghiệm bệnh lậu
--(3, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Âm tính với lậu cầu khuẩn', 3, '2025-05-10 07:45:00', N'Không triệu chứng rõ ràng, xét nghiệm theo khuyến nghị', N'Đã hoàn thành'),

---- Xét nghiệm giang mai
--(4, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Âm tính', 3, '2025-05-12 10:00:00', N'Không có dấu hiệu nghi ngờ, xét nghiệm theo chương trình STIs', N'Đã hoàn thành'),

---- Xét nghiệm HPV
--(5, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Không phát hiện chủng HPV nguy cơ cao', 3, '2025-05-14 10:30:00', N'Khuyến nghị tái xét nghiệm sau 3 năm', N'Đã hoàn thành'),

---- Xét nghiệm tổng quát STIs
--(6, '2004-11-05', 'Male', '0977665544', N'Nguyễn Trọng Tốt', 5, N'Không phát hiện bất thường', 3, '2025-05-18 08:30:00', N'Tổng kiểm tra STIs trước lập gia đình', N'Đã hoàn thành');





--=====================================================================================================================================================
--feedback
--INSERT INTO Feedback (AppointmentID, RecordID, Rating, Comment, FeedbackDate)
--VALUES
--(NULL, 1, 5, N'Dịch vụ tư vấn rất tận tâm và rõ ràng. Cảm ơn nhân viên y tế.', GETDATE()),
--(NULL, 2, 4, N'Kết quả xét nghiệm được giải thích kỹ. Cần theo dõi thêm.', GETDATE()),
--(NULL, 3, 5, N'Rất hài lòng với quy trình xét nghiệm nhanh gọn và sạch sẽ.', GETDATE()),
--(NULL, 4, 5, N'Tư vấn chi tiết, bác sĩ thân thiện và có tâm.', GETDATE()),
--(NULL, 5, 4, N'Dịch vụ ổn, nhân viên nhẹ nhàng, phòng xét nghiệm sạch sẽ.', GETDATE()),
--(NULL, 6, 5, N'Không có vấn đề gì. Trải nghiệm xét nghiệm khá thoải mái.', GETDATE()),
--(NULL, 7, 5, N'Cảm ơn vì giúp tôi yên tâm hơn về tình trạng sức khỏe.', GETDATE()),
--(NULL, 8, 5, N'Xét nghiệm tổng quát rất cần thiết. Cảm thấy an toàn hơn.', GETDATE());

--Table [dbo].[Notification]
INSERT INTO Notification (UserID, Title, [Content], SendTime, IsRead)
VALUES
(3, N'Thông báo hệ thống', N'Hệ thống sẽ bảo trì lúc 23:00 đêm nay.', GETDATE(), 0),
(3, N'Xác nhận email', N'Vui lòng xác nhận email để tiếp tục sử dụng dịch vụ.', GETDATE(), 0),
(4, N'Cập nhật hồ sơ', N'Hồ sơ của bạn đã được cập nhật thành công.', GETDATE(), 1),
(5, N'Thông báo thanh toán', N'Giao dịch #TX2931 đã được xác nhận.', GETDATE(), 0),
(4, N'Mật khẩu đã thay đổi', N'Bạn vừa thay đổi mật khẩu thành công.', GETDATE(), 1);



--Còn 6 bảng -=====================================================================================================================================================
--Table [dbo].[ReproductiveCycle] is empty
--Table [dbo].[ReportServiceDetail] is empty
--Table [dbo].[OTPRequest] is empty
--Table [dbo].[Payment] is empty
--Table [dbo].[Invoice] is empty