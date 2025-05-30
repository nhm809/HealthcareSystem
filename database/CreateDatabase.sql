

--Create database GenderHealthyService 
--go
use GenderHealthyService
go

-- 1. User
CREATE TABLE [User] (
    UserID INT PRIMARY KEY Identity(1,1),
    FullName NVARCHAR(50),
    PasswordHash VARCHAR(100) NOT NULL ,
    Email VARCHAR(100) NOT NULL ,
    PhoneNumber VARCHAR(15),
    Dob DATE,
    Gender VARCHAR(15) CHECK (Gender IN ('Male', 'Female', 'Other')),
    [Address] NVARCHAR(100),
    CreateDate DATE,
    Avatar VARCHAR(200)
);


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

-- 4. Role
CREATE TABLE Role (
    RoleUserID INT PRIMARY KEY IDENTITY(1,1), -- Khóa chính riêng cho mỗi dòng
    RoleID VARCHAR(20),                       -- Mã vai trò như 'AD', 'CS'
    UserID INT,
    RoleName VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
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






