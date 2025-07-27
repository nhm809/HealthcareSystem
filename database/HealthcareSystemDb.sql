use [HealthcareSystemDb]

--Role --=====================================================================================================================================================
INSERT INTO [Role] ([RoleID], [RoleName], [RoleDescription]) VALUES
('AD', 'Admin', N'Quản trị viên toàn hệ thống'),
('MG', 'Manager', N'Quản lý người dùng và dịch vụ'),
('ST', 'Staff', N'Bác sĩ/tư vấn viên thực hiện chẩn đoán'),
('CS', 'Consultant', N'Nhân viên tư vấn'),  --
('MB', 'Member', N'Thành viên/khách hàng sử dụng dịch vụ');


INSERT INTO dbo.[User] (
    Provider, GoogleId, FullName, PasswordHash, Email, PhoneNumber, 
    DoB, Gender, Address, CreateDate, Avatar, RoleID, 
    RefreshToken, RefreshTokenExpiryTime, IsAvailable
)
VALUES
('Local', NULL, N'Nguyễn Hữu Mỹ', '$2b$12$Pxl1ujUjOPYdRWjahaiX5.T5dGh32eIsLim6cS9qxbZCdRM2Moa5K', 'admin@gmail.com', '0970604318', '2000-08-07', 'MALE', N'Quận 9, TP. Thủ Đức, TP.HCM', '2025-02-18', NULL, 'AD', NULL, NULL, 1),
('Local', NULL, N'Tống Ngọc Anh Tài', '$2b$12$3HxIeXlkXQ3IeQ/DElsoEuHIDIsMAAGe6EdWthucDyXVUltWEE3hu', 'taitongngocanh@gmail.com', '0844058430', '1993-12-14', 'MALE', N'Quận 1, TP.HCM', '2024-11-16', NULL, 'MG', NULL, NULL, 1),
('Local', NULL, N'Phạm Nguyễn Đăng Hải', '$2b$12$hjtLyni3G0HRc2ZW80Pqy.iehAis/gEXgwFM90QxoZ5.SeXFQlAPy', 'pndhai@gmail.com', '0924364761', '1994-03-20', 'MALE', N'Quận 3, TP.HCM', '2024-10-07', NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn Hiếu', '$2b$12$c/AAkCxOXWR3NV9eoTuYZux5omogNoyNn/kwIfw8cCJzm51F.08Km', 'hieubmk2210@gmail.com', '0970055076', '1990-09-18', 'MALE', N'Quận 5, TP.HCM', '2024-11-24', NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Trọng Tốt', '$2b$12$S3vJka0JR7z/6nQzCWggZ.xepI5V35EwsA9qhKpM5lRRxINuD8KMe', 'totn786@gmail.com', '0830235422', '1993-01-16', 'MALE', N'Quận 7, TP.HCM', '2024-07-19', NULL, 'CS', NULL, NULL, 1),
-- ST
('Local', NULL, N'Trần Minh Nhật', '$2b$12$3cp8.Ow3.K9IcQ755h/AQemjyo3HvJihF1t1DnkE/SrkvvgXJ98V6', 'st1@gmail.com', '0850535918', '1997-05-13', 'MALE', N'Ba Đình, Hà Nội', '2025-02-15', NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Lê Thị Mai', '$2b$12$Z3t4PM.cwdj15n7WE4iukOKCpX64O2xiJrYw/yNnZwPtu/id7Ulqy', 'st2@gmail.com', '0887788836', '1991-04-16', 'FEMALE', N'Cầu Giấy, Hà Nội', '2024-10-10', NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Võ Quốc Duy', '$2b$12$89QkxPonD5JMDU.1huUGGu1BozLmOwUNKmoAJPJF1llv7hInR5CO2', 'st3@gmail.com', '0929554192', '1988-08-27', 'MALE', N'Đống Đa, Hà Nội', '2025-03-01', NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Bùi Thị Ngọc Lan', '$2b$12$mYXj/4b3m0aO1UrTcU16DudS/NlzY2HKnnlzcj3JBq5k6eTgSMw4.', 'st4@gmail.com', '0966782683', '2000-05-13', 'FEMALE', N'Tây Hồ, Hà Nội', '2024-10-31', NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn Khánh', '$2b$12$HMoag.2c2xwHEvF/mHNRl.gMTILC0UiTXg9ktP2Zr7w9argdcVAVa', 'st5@gmail.com', '0923819850', '1999-06-15', 'MALE', N'Thanh Xuân, Hà Nội', '2024-11-01', NULL, 'ST', NULL, NULL, 1),

-- CS
('Local', NULL, N'Nguyễn Nguyệt Thiên Kim', '$2b$12$wSZBfgrmVSrLZ2bdQF06u.nDqlpw0XSsQGMP4IDKqmm0HCV8tlp76', 'cs1@gmail.com', '0949674595', '1991-11-21', 'FEMALE', N'Tân Bình, TP.HCM', '2024-09-10', NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn Giao', '$2b$12$MbuVCH/y24/h32Ur0CHspui1EFCoGhPb0xmP3FMVAlRuyp.VYARDi', 'cs2@gmail.com', '0919801562', '1985-01-31', 'MALE', N'Gò Vấp, TP.HCM', '2024-08-16', NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Trần Thị Kim Ngân', '$2b$12$EcD9DhEhG/UWS1ZSdvojFOVU6abjJkiCDkKiYBKUtRuxFpW20CoYa', 'cs3@gmail.com', '0850570828', '1994-12-20', 'FEMALE', N'Phú Nhuận, TP.HCM', '2025-01-26', NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Lê Quốc Hưng', '$2b$12$5PsH27XHdXMQHOCKIDTdeeRUAMXpdBUQlIOsjTKFSGnEqLXSUSLTG', 'cs4@gmail.com', '0917015014', '1991-11-12', 'MALE', N'Thủ Đức, TP.HCM', '2024-12-15', NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Phạm Thị Mỹ Linh', '$2b$12$GGkIhoYhz8Q3i.Ngj.qVb.uvSMgjAiY1.L.YJp84mcp..P80.c4ti', 'cs5@gmail.com', '0961375236', '1993-01-19', 'FEMALE', N'Bình Thạnh, TP.HCM', '2024-10-02', NULL, 'CS', NULL, NULL, 1),

-- MB
('Local', NULL, N'Phạm Văn Lâm', '$2b$12$3ImHvmrpcTZ4pmSuFGJ3Tu2z2eQwDdRd3Drl2mDrUZOu0CyaOEqPW', 'mb1@gmail.com', '0848667151', '1986-11-14', 'MALE', N'Hải Châu, Đà Nẵng', '2024-11-29', NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Thị Bích Trâm', '$2b$12$.TjUlnCV5kveIaB3HqndC.LGh9Oe1b.DLkGL7GPAv9NIm2Fc2DNQu', 'mb2@gmail.com', '0976149467', '1994-12-15', 'FEMALE', N'Thanh Khê, Đà Nẵng', '2024-09-09', NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Trần Văn Nguyên', '$2b$12$P0BM/UixRPRcpzQPmBE1Au4LrHlfXInJAZzT82GoN2SQQTO6WNP0K', 'mb3@gmail.com', '0931287802', '1998-09-23', 'MALE', N'Sơn Trà, Đà Nẵng', '2024-09-25', NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Lê Thị Oanh', '$2b$12$TO7pN0Mv2WwYf3OO/cFsjOZUDHqL2IesQvgYIBzkdDjbLaSgF6avi', 'mb4@gmail.com', '0961377191', '1985-11-14', 'FEMALE', N'Ngũ Hành Sơn, Đà Nẵng', '2024-09-12', NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Đỗ Văn Phúc', '$2b$12$BFKrN3o41xu0qzFHrUQURO/k8HWnLJbvgGDZyw.HStDg4dB0yysC.', 'mb5@gmail.com', '0931677872', '1999-02-13', 'MALE', N'Liên Chiểu, Đà Nẵng', '2024-09-20', NULL, 'MB', NULL, NULL, 1);


--Specialty--=====================================================================================================================================================
INSERT INTO Specialty ([Name], [Description], [IsDeleted]) VALUES
(N'Sản Phụ Khoa', N'Tư vấn và điều trị các vấn đề liên quan đến chu kỳ kinh nguyệt, sinh sản, viêm nhiễm phụ khoa, kế hoạch hóa gia đình, và sức khỏe sinh sản nữ.', 0),
(N'Nam Khoa', N'Tư vấn và điều trị các vấn đề sinh lý nam, rối loạn cương dương, sức khỏe tinh trùng, bệnh lý tiết niệu nam.', 0),
(N'Da liễu - STIs', N'Chẩn đoán và điều trị các bệnh lây truyền qua đường tình dục như HIV, giang mai, lậu, sùi mào gà,... và tư vấn phòng tránh.', 0),
(N'Tâm lý học', N'Tư vấn các vấn đề tâm lý liên quan đến giới tính, bản dạng giới, rối loạn lo âu, trầm cảm, và hỗ trợ cho nhóm LGBTQ+.', 0),
(N'Y học tổng quát', N'Đánh giá tổng quát sức khỏe, tư vấn điều trị các bệnh nền ảnh hưởng đến sinh sản, kê đơn thuốc cơ bản.', 0),
(N'Dược học', N'Tư vấn sử dụng thuốc tránh thai, thuốc điều trị STIs, giải thích tác dụng phụ và tương tác thuốc.', 0),
(N'Giáo dục giới tính', N'Cung cấp kiến thức về sức khỏe giới tính, tình dục an toàn và nâng cao nhận thức cộng đồng.', 0),
(N'Xét nghiệm y khoa', N'Thực hiện và phân tích các xét nghiệm STIs, hỗ trợ quản lý quy trình xét nghiệm và trả kết quả.', 0);


--Service--=====================================================================================================================================================
INSERT INTO Service ( Name, Description, Price)
VALUES
(N'Xét nghiệm tổng quát STIs', N'Kiểm tra tổng quát các bệnh lây truyền qua đường tình dục ,Xét nghiệm theo quá trình', 1000000),
(N'Tư vấn sức khỏe', N'Tư vấn 1:1 với chuyên gia về sức khỏe.', 150000)


--[UserSpecialty]--=====================================================================================================================================================
INSERT INTO dbo.UserSpecialty (UserID, SpecialtyID)
VALUES
-- Phạm Nguyễn Đăng Hải (ST)
(3, 1),  -- Sản Phụ Khoa

-- Nguyễn Trọng Tốt (CS)
(5, 3),  -- Da liễu - STIs
(5, 8),  -- Xét nghiệm y khoa

-- Các ST khác
(6, 5),  -- Y học tổng quát
(6, 8),  -- Xét nghiệm y khoa

(7, 1),  -- Sản Phụ Khoa
(7, 5),  -- Y học tổng quát

(8, 5),  -- Y học tổng quát

(9, 5),  -- Y học tổng quát
(9, 6),  -- Dược học

(10, 5), -- Y học tổng quát
(10, 7), -- Giáo dục giới tính

-- Các CS khác
(11, 2), -- Nam khoa cho Tai`

(12, 3), -- Da liễu - STIs
(12, 7), -- Giáo dục giới tính

(13, 7), -- Giáo dục giới tính

(14, 4), -- Tâm lý học
(14, 8), -- Xét nghiệm y khoa

(15, 3) -- Da liễu - STIs




INSERT INTO dbo.Appointment (
    MemberID, MeetLink, ServiceID, ConsultantID, 
    StartTime, EndTime, Status, Symptoms
)
VALUES
-- Da danh gia (2)
(4, 'https://meet.google.com/abc-defg-hij', 2, 14, '2025-07-20 15:00:00.000', '2025-07-20 15:30:00.000', N'Da danh gia', N'Tư vấn tâm lý'),
(20, 'https://meet.google.com/bcd-yzab-ijk', 2, 13, '2025-07-21 10:00:00.000', '2025-07-21 10:30:00.000', N'Da danh gia', N'Rối loạn lo âu'),

-- Da hoan thanh (2)
(16, 'https://meet.google.com/bcd-efgh-ijk', 2, 11, '2025-07-22 09:00:00.000', '2025-07-22 09:30:00.000', N'Da hoan thanh', N'Tư vấn mối quan hệ'),
(17, 'https://meet.google.com/bcd-efgh-yzab', 2, 5,  '2025-07-23 14:00:00.000', '2025-07-23 14:30:00.000', N'Da hoan thanh', N'Tư vấn tâm lý'),

-- Dang cho kham (3)
(4, 'https://meet.google.com/bcd-jklm-ijk', 2, 11, '2025-07-24 14:00:00.000', '2025-07-24 14:30:00.000', N'Dang cho kham', N'Đau đầu'),
(16, 'https://meet.google.com/bcd-efgh-jklm', 2, 11, '2025-07-23 16:00:00.000', '2025-07-23 16:30:00.000', N'Dang cho kham', N'Stress học tập'),
(17, 'https://meet.google.com/bcd-efgh-ijk', 2, 11, '2025-07-22 14:00:00.000', '2025-07-22 14:30:00.000', N'Dang cho kham', N'Khó khăn tài chính'),

(16, 'https://meet.google.com/bcd-jklm-ijk', 2, 5, '2025-07-24 13:00:00.000', '2025-07-24 13:30:00.000', N'Dang cho kham', N'Đau đầu'),
(17, 'https://meet.google.com/bcd-efgh-jklm', 2, 5, '2025-07-23 14:00:00.000', '2025-07-23 14:30:00.000', N'Dang cho kham', N'Tư vấn tâm lý'),
(18, 'https://meet.google.com/bcd-efgh-ijk', 2, 5, '2025-07-22 15:00:00.000', '2025-07-22 15:30:00.000', N'Dang cho kham', N'Khó khăn tài chính'),

(18, 'https://meet.google.com/bcd-jklm-ijk', 2, 12, '2025-07-24 14:00:00.000', '2025-07-24 14:30:00.000', N'Dang cho kham', N'Tư vấn tâm lý'),
(19, 'https://meet.google.com/bcd-efgh-jklm', 2, 12, '2025-07-23 13:00:00.000', '2025-07-23 13:30:00.000', N'Dang cho kham', N'Stress học tập'),
(20, 'https://meet.google.com/bcd-efgh-ijk', 2, 12, '2025-07-22 15:00:00.000', '2025-07-22 15:30:00.000', N'Dang cho kham', N'Khó khăn tài chính'),

(19, 'https://meet.google.com/bcd-jklm-ijk', 2, 13, '2025-07-24 14:00:00.000', '2025-07-24 14:30:00.000', N'Dang cho kham', N'Đau đầu'),
(20, 'https://meet.google.com/bcd-efgh-jklm', 2, 13, '2025-07-23 13:00:00.000', '2025-07-23 13:30:00.000', N'Dang cho kham', N'Stress học tập'),
(4, 'https://meet.google.com/bcd-efgh-ijk', 2, 13, '2025-07-22 15:00:00.000', '2025-07-22 15:30:00.000', N'Dang cho kham', N'Tư vấn tâm lý'),

(20, 'https://meet.google.com/bcd-jklm-ijk', 2, 14, '2025-07-24 14:00:00.000', '2025-07-24 14:30:00.000', N'Dang cho kham', N'Đau đầu'),
(4, 'https://meet.google.com/bcd-efgh-jklm', 2, 14, '2025-07-23 13:00:00.000', '2025-07-23 13:30:00.000', N'Dang cho kham', N'Rối loạn lo âu'),
(16, 'https://meet.google.com/bcd-efgh-ijk', 2, 14, '2025-07-22 15:00:00.000', '2025-07-22 15:30:00.000', N'Dang cho kham', N'Khó khăn tài chính'),


(4, 'https://meet.google.com/bcd-jklm-ijk', 2, 15, '2025-07-23 14:00:00.000', '2025-07-24 14:30:00.000', N'Dang cho kham', N'Rối loạn lo âu'),
(20, 'https://meet.google.com/bcd-efgh-jklm', 2, 15, '2025-07-23 13:00:00.000', '2025-07-23 13:30:00.000', N'Dang cho kham', N'Stress học tập'),
(18, 'https://meet.google.com/bcd-efgh-ijk', 2, 15, '2025-07-22 15:00:00.000', '2025-07-22 15:30:00.000', N'Dang cho kham', N'Khó khăn tài chính'),

-- Dang thanh toan (2)
(4, '', 2, 15, '2025-07-24 15:30:00.000', '2025-07-24 16:00:00.000', N'Dang thanh toan', N'Khó ngủ'),
(16, '', 2, 11, '2025-07-22 11:00:00.000', '2025-07-22 11:30:00.000', N'Dang thanh toan', N'Áp lực công việc'),

-- Da huy (2)
(17, '', 2, 12, '2025-07-24 13:30:00.000', '2025-07-24 14:00:00.000', N'Da huy', N'Tôi cần tư vấn tâm lý sau khi sinh'),
(18, '', 2, 5,  '2025-07-21 16:00:00.000', '2025-07-21 16:30:00.000', N'Da huy', N'Không còn nhu cầu tư vấn');




--TestServiceRecord --=====================================================================================================================================================
INSERT INTO TestServiceRecord (
    ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember,
    MemberID, Result, StaffID, RecordDate, TestDate,
    TimeSlot, Notes, Status
)
VALUES
-- ✅ Da danh gia: 4 (Nguyễn Văn Hiếu), 20 (Đỗ Văn L)
(1, '2004-04-06', N'MALE', '0975672459', N'Nguyễn Văn Hiếu',
 4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752915543/mvszssp7fpthqweeh51i.jpg', 3,
 '2025-07-20', '2025-07-21', '08:00:00.0000000', N'Đã có kết quả xét nghiệm', N'Da danh gia'),

(1, '2002-01-02', N'MALE', '0377681234', N'Đỗ Văn Phúc',
 20, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752918765/sample_result1.jpg', 6,
 '2025-07-20', '2025-07-21', '08:00:00.0000000', N'Kết luận đầy đủ và chính xác', N'Da danh gia'),

-- 🟩 Da hoan thanh: 16 (Phạm Văn L), 17 (Lê Văn Tài)
(1, '1990-01-01', N'MALE', '0900000021', N'Phạm Văn Lâm',
 16, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752463186/aq4lk1js0gofqlvsbqlp.jpg', 3,
 '2025-07-21', '2025-07-22', '08:00:00.0000000', N'Xét nghiệm hoàn tất', N'Da hoan thanh'),

(1, '2001-03-05', N'MALE', '0371234567', N'Nguyễn Thị Bích Trâm',
 17, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752918765/sample_result1.jpg', 7,
 '2025-07-21', '2025-07-22', '08:00:00.0000000', N'Hoàn tất xét nghiệm', N'Da hoan thanh'),

-- 🟡 Dang cho kham: 18, 19, 20
(1, '1990-08-08', N'MALE', '0975672123', N'Trần Văn Nguyên',
 18, NULL, 3,
 '2025-07-22', '2025-07-24', '08:00:00.0000000', N'Chờ khám lần đầu', N'Dang cho kham'),

(1, '2002-04-09', N'MALE', '0931231233', N'Lê Thị Oanh',
 19, NULL, 3,
 '2025-07-22', '2025-07-25', '08:00:00.0000000', N'Đã lấy mẫu máu', N'Dang cho kham'),

(1, '2002-01-02', N'MALE', '0377681234', N'Đỗ Văn Phúc',
 20, NULL, 6,
 '2025-07-22', '2025-07-26', '08:00:00.0000000', N'Chưa đủ điều kiện xét nghiệm', N'Dang cho kham'),

-- 🟧 Dang thanh toan: 4, 16
(1, '2004-04-06', N'MALE', '0975672459', N'Nguyễn Văn Hiếu',
 4, NULL, NULL,
 '2025-07-23', '2025-07-24', '08:00:00.0000000', NULL, N'Dang thanh toan'),

(1, '1990-01-01', N'MALE', '0900000021', N'Phạm Văn Lâm',
 16, NULL, NULL,
 '2025-07-23', '2025-07-24', '08:00:00.0000000', NULL, N'Dang thanh toan'),

-- ❌ Da huy: 17, 18
(1, '2001-03-05', N'MALE', '0371234567', N'Nguyễn Thị Bích Trâm',
 17, NULL, NULL,
 '2025-07-24', '2025-07-26', '08:00:00.0000000', N'Hủy do lý do cá nhân', N'Da huy'),

(1, '1990-08-08', N'MALE', '0975672123', N'Trần Văn Nguyên',
 18, NULL, NULL,
 '2025-07-24', '2025-07-26', '08:00:00.0000000', N'Khách tự hủy lịch', N'Da huy') ,
-- 🟦 Dang thuc hien: 5, 6
(1, '2000-12-12', N'MALE', '0371234568', N'Phạm Văn Lâm',
 16, NULL, 6,
 '2025-07-23', '2025-07-25', '08:00:00.0000000', N'Đang tiến hành xét nghiệm máu', N'Dang thuc hien'),

(1, '2000-01-01', N'FEMALE', '0934567890', N'Nguyễn Thị Bích Trâm',
 17, NULL, 7,
 '2025-07-23', '2025-07-25', '08:00:00.0000000', N'Đang tiến hành phân tích mẫu', N'Dang thuc hien');


INSERT INTO Question (
   MemberID, SpecialtyId, TitleQuestion, Content, AttachmentPath, SubmitDate, ConsultantID, [Status], Age, Gender, Heart, AnsCount
)
VALUES
-- Câu hỏi về sức khỏe sinh sản nữ
(16, 1, N'Trễ kinh 7 ngày, có cần lo lắng không?',
 N'Em là người chuyển giới nữ, hiện tại bị trễ kinh 7 ngày. Điều này có bình thường không, hay có vấn đề về nội tiết?',
 NULL, '2025-07-01 09:15:00', 5, N'Chưa trả lời', 27, N'Nữ', 12, 1),

-- Câu hỏi về sinh lý nam
(17, 2, N'Tôi là người chuyển giới nam, có thể khám nam khoa bình thường không?',
 N'Tôi đã tiêm testosterone 1 năm, nhưng có vấn đề về sinh lý. Tôi nên khám ở khoa nào và cần chuẩn bị gì không?',
 NULL, '2025-07-02 14:45:00', 6, N'Đang xử lý', 29, N'Nam', 8, 1),

-- Câu hỏi về bệnh lây qua đường tình dục (STIs)
(18, 3, N'Tôi quan hệ đồng giới, có cần kiểm tra STIs định kỳ không?',
 N'Tôi có quan hệ đồng giới an toàn, nhưng nghe nói vẫn nên kiểm tra STIs định kỳ. Bao lâu nên kiểm tra một lần?',
 NULL, '2025-07-03 11:30:00', 7, N'Đã trả lời', 32, N'Nam', 20, 3),

-- Câu hỏi về tâm lý giới
(19, 4, N'Làm sao để ba mẹ hiểu và chấp nhận bản dạng giới của em?',
 N'Em là người không nhị phân (non-binary), ba mẹ không hiểu và ép em sống theo giới tính sinh học. Em phải làm sao?',
 NULL, '2025-07-04 21:10:00', 8, N'Chưa trả lời', 19, N'Khác', 30, 2),

-- Câu hỏi về giáo dục giới tính
(20, 7, N'Nên dạy con về giới tính từ mấy tuổi?',
 N'Tôi có con gái 8 tuổi, muốn dạy về sự khác biệt giới tính và tôn trọng người khác. Nên bắt đầu thế nào cho phù hợp?',
 NULL, '2025-07-05 08:00:00', 9, N'Đã trả lời', 35, N'Nữ', 18, 4),
 -- Câu hỏi về giáo dục giới tính
(20, 7, N'Nên dạy con về giới tính từ mấy tuổi?',
 N'Tôi có con gái 2 tuổi, muốn dạy về sự khác biệt giới tính và tôn trọng người khác. Nên bắt đầu thế nào cho phù hợp?',
 NULL, '2025-07-05 08:00:00', 9, N'Bị từ chối', 35, N'Nữ', 18, 4),

 -- Câu hỏi 6 – Ra máu sau quan hệ (MemberID = 16)
(16, 1, N'Ra máu sau khi quan hệ có nguy hiểm không?', 
 N'Tôi bị ra máu nhẹ sau khi quan hệ với chồng, dù trước đó không có dấu hiệu bất thường. Đây có phải là dấu hiệu viêm nhiễm hay bệnh lý gì không?', 
 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753338542/pc2blenllsiapdugz9qq.jpg', 
 '2025-07-06 10:00:00', 5, N'Chưa trả lời', 30, N'Nữ', 10, 0),

-- Câu hỏi 7 – Dị ứng bao cao su (MemberID = 17)
(17, 3, N'Dị ứng bao cao su có biểu hiện thế nào?', 
 N'Mỗi lần dùng bao cao su tôi thường bị ngứa và rát vùng kín sau đó vài tiếng. Có phải tôi bị dị ứng với mủ cao su không?', 
 NULL, '2025-07-06 14:30:00', 7, N'Đã trả lời', 28, N'Nữ', 14, 2),

-- Câu hỏi 8 – Tính ngày an toàn (MemberID = 18)
(18, 1, N'Làm sao để tính ngày an toàn để tránh thai tự nhiên?', 
 N'Tôi có chu kỳ kinh đều 28 ngày, xin hỏi cách tính ngày rụng trứng và ngày nào quan hệ là an toàn?', 
 NULL, 
 '2025-07-07 08:45:00', 6, N'Chưa trả lời', 24, N'Nữ', 11, 0),

-- Câu hỏi 9 – HPV và chưa quan hệ (MemberID = 19)
(19, 3, N'30 tuổi, chưa quan hệ, có nên xét nghiệm HPV không?', 
 N'Tôi năm nay 30 tuổi, chưa từng quan hệ tình dục. Có cần tiêm vaccine và làm xét nghiệm HPV không?', 
 NULL, '2025-07-07 11:20:00', 7, N'Đang xử lý', 30, N'Nữ', 13, 1),

-- Câu hỏi 10 – Sùi mào gà (MemberID = 20)
(20, 3, N'Sùi mào gà giai đoạn đầu nhìn như thế nào?', 
 N'Tôi thấy vùng kín có mụn nhỏ li ti, không đau. Lo lắng có thể là sùi mào gà. Mong được tư vấn cụ thể hơn để đi khám sớm.', 
 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753338715/s1sdlxi9xtjppcucux4c.jpg', 
 '2025-07-07 15:10:00', 7, N'Chưa trả lời', 26, N'Nam', 22, 0);


 INSERT INTO [QuestionThreadItem] (
    QuestionID, SentAt, AnsweredAt, QuestionText, AnswerText, AttachmentPath, IsAnswered
)
VALUES
-- Thread cho QuestionID = 1 (trễ kinh)
(1, '2025-07-01 10:00:00', '2025-07-01 10:15:00', 
 N'Nếu chưa thử thai thì em nên thử vào lúc nào để chính xác nhất ạ?', 
 N'Bạn nên thử vào buổi sáng sớm, sau khi thức dậy để có kết quả chính xác hơn.', 
 NULL, 1),

(1, '2025-07-01 12:30:00', NULL, 
 N'Trễ kinh 7 ngày rồi mà thử vẫn 1 vạch thì có cần lo lắng không ạ?', 
 NULL, 
 NULL, 0),

-- Thread cho QuestionID = 2 (chuyển giới nam khám nam khoa)
(2, '2025-07-02 16:00:00', '2025-07-02 16:30:00',
 N'Tôi cần chuẩn bị giấy tờ gì khi đến khám nam khoa?',
 N'Bạn chỉ cần mang theo CMND/CCCD và các kết quả xét nghiệm cũ (nếu có).', 
 NULL, 1),

-- Thread cho QuestionID = 3 (STIs đồng giới)
(3, '2025-07-03 13:15:00', '2025-07-03 13:45:00',
 N'Có loại STIs nào chỉ xuất hiện ở quan hệ đồng giới nam không ạ?',
 N'Một số STIs có tỷ lệ cao hơn ở nhóm MSM như giang mai, HIV, nhưng không phải chỉ xuất hiện ở nhóm này.',
 NULL, 1),

(3, '2025-07-03 14:10:00', NULL,
 N'Tôi có thể đăng ký gói xét nghiệm STIs online được không?',
 NULL,
 NULL, 0),

-- Thread cho QuestionID = 4 (tâm lý bản dạng giới)
(4, '2025-07-04 22:30:00', NULL,
 N'Làm sao để giảm stress khi bị ba mẹ phản đối giới tính của mình?',
 NULL,
 NULL, 0),

-- Thread cho QuestionID = 5 (giáo dục giới tính trẻ em)
(5, '2025-07-05 09:15:00', '2025-07-05 10:00:00',
 N'Nên giải thích giới tính thứ ba cho trẻ như thế nào để bé không bị hoang mang?',
 N'Hãy nói về sự đa dạng giới tính một cách đơn giản, dùng ví dụ thực tế và nhấn mạnh sự tôn trọng lẫn nhau.',
 NULL, 1),
 -- Thread cho QuestionID = 6
(6, '2025-07-06 10:30:00', NULL,
 N'Ra máu sau khi quan hệ có cần đi khám phụ khoa gấp không?',
 NULL,
 NULL, 0),

-- Thread cho QuestionID = 7
(7, '2025-07-06 15:00:00', '2025-07-06 16:10:00',
 N'Tôi nên chuyển sang loại bao nào nếu bị dị ứng với latex?',
 N'Bạn có thể thử bao cao su làm từ polyurethane hoặc polyisoprene – ít gây dị ứng hơn.',
 NULL, 1),

(7, '2025-07-06 16:15:00', NULL,
 N'Ngứa nhẹ có phải là bình thường sau khi dùng bao cao su không?',
 NULL,
 NULL, 0),

-- Thread cho QuestionID = 8
(8, '2025-07-07 09:10:00', NULL,
 N'Chu kỳ em đều 28 ngày, ngày nào là ngày rụng trứng?',
 NULL,
 NULL, 0),

-- Thread cho QuestionID = 9
(9, '2025-07-07 11:45:00', '2025-07-07 12:30:00',
 N'Người chưa từng quan hệ có cần tiêm vaccine HPV không?',
 N'Có. WHO khuyến nghị nên tiêm trước khi có quan hệ tình dục lần đầu để đạt hiệu quả bảo vệ cao nhất.',
 NULL, 1),

-- Thread cho QuestionID = 10
(10, '2025-07-07 15:30:00', NULL,
 N'Làm sao phân biệt sùi mào gà với mụn cóc sinh dục thông thường?',
 NULL,
 NULL, 0);



---Blog-=====================================================================================================================================================
INSERT INTO dbo.Blog (Title, Content, Description, ConsultantID, PublishDate, Topic, Status )
VALUES
(N'Quan hệ xong 1 ngày sau có kinh có thai không?', 
N'Hiểu biết về khả năng mang thai trong các giai đoạn của chu kỳ kinh nguyệt giúp bạn chủ động hơn trong việc phòng tránh thai hoặc lên kế hoạch sinh con. Đặc biệt, với trường hợp quan hệ xong 1 ngày sau có kinh, nhiều người băn khoăn liệu đây có phải thời điểm an toàn hay vẫn có nguy cơ mang thai ngoài ý muốn. Bài viết dưới đây sẽ cung cấp đến bạn các thông tin để giải đáp cho câu hỏi quan hệ xong 1 ngày sau có kinh có thai không.

Quan hệ xong 1 ngày sau có kinh có thai không?
Quan hệ tình dục 1 ngày trước khi có kinh vẫn có khả năng mang thai, nhưng rất thấp. Vì lúc này thường không phải thời điểm rụng trứng. Tuy nhiên, nếu chu kỳ kinh nguyệt không đều, tinh trùng sống lâu trong âm đạo thì vẫn có khả năng thụ thai.

Mang thai xảy ra khi tinh trùng gặp trứng và thụ tinh thành công. Thông thường, sự rụng trứng diễn ra vào khoảng giữa chu kỳ kinh nguyệt ở phụ nữ có chu kỳ đều đặn 28 ngày (khoảng ngày 12 - 16 của chu kỳ). Sau khi rụng, trứng chỉ có khả năng sống sót trong khoảng 12 - 24 giờ. Trong khi đó, tinh trùng khỏe mạnh có thể tồn tại trong hệ sinh dục nữ (tử cung và ống dẫn trứng) từ 3 - 5 ngày. Do đó, quan hệ tình dục vào thời điểm gần ngày rụng trứng sẽ làm tăng khả năng thụ thai.',
N'“Quan hệ xong 1 ngày sau có kinh có thai không?” là câu hỏi khiến nhiều người lo lắng, đặc biệt với những ai chưa hiểu rõ về khả năng thụ thai trong từng giai đoạn của chu kỳ kinh nguyệt. Để giải đáp vấn đề này, hãy cùng tìm hiểu qua bài viết sau đây.',
11, '2025-07-24', N'Sức khỏe', 1),

(N'Âm đạo là gì? Vị trí, cấu tạo và chức năng âm đạo',
N'Nhiều người vẫn nhầm lẫn giữa âm đạo và âm hộ, hoặc chưa nắm rõ vị trí, cấu trúc, cũng như chức năng cụ thể của âm đạo. Bài viết này sẽ cung cấp thông tin chi tiết, chuẩn xác từ các nguồn y tế uy tín trong và ngoài nước, giúp bạn tự tin hơn trong việc chăm sóc vùng kín và bảo vệ sức khỏe sinh sản.

Âm đạo là gì?
Âm đạo là một ống cơ - màng nhầy nối tử cung với cửa ngoài của cơ quan sinh dục nữ. Đây là một phần quan trọng trong hệ sinh sản, nằm hoàn toàn bên trong cơ thể, khác với âm hộ - phần bên ngoài bao gồm môi lớn, môi nhỏ và âm vật. Âm đạo có đặc tính đàn hồi, co giãn mạnh, và có khả năng tự bôi trơn khi được kích thích, hỗ trợ cho các chức năng sinh lý như quan hệ tình dục và sinh sản.

Hàm lượng dịch tiết âm đạo thay đổi tùy theo chu kỳ kinh nguyệt, trạng thái kích thích, hoặc tình trạng sức khỏe. Âm đạo không chỉ là một cơ quan sinh sản mà còn đóng vai trò trong việc duy trì sức khỏe tổng thể của phụ nữ khi được chăm sóc đúng cách.',
N'Âm đạo là ống cơ đàn hồi nằm bên trong cơ thể phụ nữ, có vai trò quan trọng trong quan hệ tình dục, kinh nguyệt, thụ thai và sinh sản. Hiểu đúng về âm đạo là gì giúp phòng tránh viêm nhiễm và bảo vệ sức khỏe sinh sản. Cùng tìm hiểu sâu hơn về chủ đề này trong bài viết dưới đây của Nhà thuốc Long Châu!',
15, '2025-07-24', N'Hướng dẫn', 1),

(N'Thai IVF 10 tuần phát triển thế nào? Có nguy cơ gì cần theo dõi?',
N'Tuần thứ 10 của thai kỳ IVF đánh dấu một cột mốc quan trọng khi phôi thai đang hoàn thiện các cơ quan và bước vào giai đoạn phát triển ổn định hơn. Tuy nhiên, do đặc thù thai IVF vốn nhạy cảm, mẹ bầu vẫn cần theo dõi sát sao để đảm bảo thai nhi phát triển khỏe mạnh. Vậy thai IVF 10 tuần phát triển thế nào và có những nguy cơ nào cần lưu ý?

Sự phát triển của thai IVF 10 tuần
Ở tuần thai thứ 10, thai IVF đang trải qua một giai đoạn phát triển rất quan trọng với nhiều thay đổi rõ rệt. Lúc này, thai nhi có chiều dài khoảng 3 - 4 cm và cân nặng khoảng 4 - 5g, tương đương kích thước của một quả dâu tây.

Dù còn bé, nhưng hầu hết các cơ quan chính như não bộ, tim, gan, thận và ruột đã bắt đầu hình thành gần như hoàn chỉnh và tiếp tục phát triển mạnh mẽ.

Các đặc điểm bên ngoài như mắt, tai, miệng, tay chân cũng ngày càng rõ ràng hơn. Đặc biệt, thai IVF 10 tuần bắt đầu xuất hiện phản xạ nhẹ, có thể di chuyển khi bị chạm vào thành tử cung, mặc dù mẹ vẫn chưa cảm nhận được những chuyển động này.

Tim thai đã hoạt động rõ ràng với nhịp đập từ 120 - 180 lần/phút và có thể nghe thấy bằng thiết bị siêu âm Doppler, khiến các mẹ IVF cảm thấy an tâm hơn rất nhiều.

Ngoài ra, nhau thai cũng bắt đầu đảm nhận chức năng vận chuyển chất dinh dưỡng và hormone cho thai nhi. Đây là giai đoạn đánh dấu sự phát triển khỏe mạnh ban đầu của em bé và là một cột mốc tinh thần quan trọng cho mẹ sau quá trình IVF đầy lo lắng.',
N'Tuần thứ 10 của thai kỳ IVF là giai đoạn quan trọng với nhiều cột mốc phát triển vượt bậc của thai nhi và những thay đổi đáng chú ý ở mẹ. Bài viết này sẽ cùng bạn khám phá sự phát triển của thai IVF 10 tuần và những điều mẹ cần lưu ý để có một thai kỳ khỏe mạnh.',
13, '2025-07-24', N'Sức khỏe', 1),

(N'Rối loạn phóng noãn nên ăn gì và không nên ăn gì?',
N'Bạn đang mong con nhưng chu kỳ kinh nguyệt rối loạn, trứng không rụng đều khiến việc thụ thai trở nên khó khăn? Một trong những nguyên nhân khá phổ biến là rối loạn phóng noãn, khiến trứng không rụng đều đặn mỗi tháng. Chế độ ăn uống khoa học có thể cải thiện đáng kể tình trạng này.

Trong bài viết này, mình sẽ cùng bạn tìm hiểu rối loạn phóng noãn nên ăn gì để hỗ trợ sinh sản một cách tốt nhất.

Rối loạn phóng noãn nên ăn gì?
Chế độ dinh dưỡng đóng vai trò quan trọng trong việc hỗ trợ cải thiện chức năng buồng trứng và khả năng rụng trứng tự nhiên. Với tình trạng rối loạn phóng noãn, dưới đây là những thực phẩm bạn nên ăn để cân bằng nội tiết và tăng khả năng thụ thai:

Thực phẩm giàu đạm thực vật
Các thực phẩm có chứa nhiều đạm thực vật như đậu nành, đậu lăng, đậu xanh, hạt chia, hạt bí hay hạt hướng dương không chỉ giàu protein mà còn chứa nhiều phytoestrogen – hợp chất có khả năng cân bằng nội tiết tố nữ. Một nghiên cứu nổi bật từ Đại học Harvard cho thấy việc thay thế một phần đạm động vật bằng đạm thực vật có thể góp phần giảm nguy cơ vô sinh liên quan đến rối loạn phóng noãn.

Omega 3 và chất béo không bão hòa
Các loại chất béo tốt như Omega-3 và chất béo không bão hòa đơn có vai trò quan trọng trong việc điều hòa hormone sinh sản và cải thiện chất lượng nang noãn.

Cá hồi, cá thu, quả bơ, dầu ô-liu, hạt lanh,… là những nguồn thực phẩm lý tưởng mà phụ nữ rối loạn phóng noãn nên ăn thường xuyên.

Đồng thời, họ cũng nên hạn chế tối đa chất béo bão hòa từ đồ chiên rán, thức ăn nhanh vì chúng có thể khiến tình trạng mất cân bằng nội tiết thêm trầm trọng.',
N'Rối loạn phóng noãn là nguyên nhân phổ biến gây khó thụ thai ở nữ giới. Bên cạnh việc điều trị y tế, chế độ ăn uống đóng vai trò quan trọng trong việc cải thiện chức năng rụng trứng. Vậy rối loạn phóng noãn nên ăn gì để hỗ trợ khả năng sinh sản một cách tự nhiên?',
15, '2025-07-24', N'Hướng dẫn', 1),

(N'Giải đáp thắc mắc: Tắc 1 bên vòi trứng có thai được không?',
N'Khi bị chẩn đoán tắc một bên vòi trứng, nhiều phụ nữ lo lắng về khả năng làm mẹ của mình. Liệu tắc 1 bên vòi trứng có thai được không? Bài viết này sẽ giúp bạn trả lời câu hỏi này và kịp thời áp dụng các biện pháp phù hợp giúp có thai.',
N'Khi bị chẩn đoán tắc một bên vòi trứng, nhiều phụ nữ lo lắng về khả năng làm mẹ của mình. Liệu tắc 1 bên vòi trứng có thai được không? Bài viết này sẽ giúp bạn trả lời câu hỏi này và kịp thời áp dụng các biện pháp phù hợp giúp có thai.',
11, '2025-07-24', N'Sức khỏe', 1),
 
 (N'Sức khỏe hệ sinh sản của nam và nữ là gì?',
N'Sức khỏe hệ sinh sản đảm bảo mọi người có một đời sống tình dục hạnh phúc và an toàn, mang khả năng sinh sản và được quyền chủ động quyết định thời gian và số lần mang thai. Sức khỏe sinh sản của nam và nữ là những khía cạnh quan trọng của hệ thống sinh sản về mặt tổng thể vì cả hai đều tham gia vào quá trình tạo ra một sinh linh mới. Vậy thì sức khỏe hệ sinh sản là gì, hãy tìm hiểu cùng MedSex nhé.

1. Sức khỏe hệ sinh sản là gì?
Theo WHO, sức khỏe hệ sinh sản là trạng thái hoàn toàn khỏe mạnh, hài hòa về thể chất, tinh thần và xã hội ở mọi khía cạnh liên quan đến hệ thống, chức năng và quá trình sinh sản trong suốt các giai đoạn của cuộc đời, chứ không đơn thuần chỉ là không có bệnh tật hoặc ốm đau. Sức khỏe sinh sản bao gồm:

- Sức khỏe thể chất: cơ thể khỏe mạnh, các cơ quan sinh dục nam, nữ không bị tổn thương và đảm bảo cho việc thực hiện chức năng tình dục và sinh sản.
- Sức khỏe tinh thần: cá nhân cảm thấy thoải mái với chính mình về sức khỏe sinh sản và tình dục, biết thừa nhận những nhược điểm, không tự ti, sống đoàn kết với mọi người.
- Sức khỏe xã hội: đảm bảo sự an toàn cho xã hội, có mối quan hệ tốt với cộng đồng.',
N'Sức khỏe hệ sinh sản đảm bảo mọi người có một đời sống tình dục hạnh phúc và an toàn, mang khả năng sinh sản và được quyền chủ động quyết định thời gian và số lần mang thai. Hãy tìm hiểu sức khỏe hệ sinh sản cùng Genetica nhé.',
12, '2025-07-24', N'Sức khỏe', 1),

(N'Ra huyết trắng nhiều là sắp có kinh hay có thai? Dấu hiệu và lời khuyên hữu ích',
N'Nhiều chị em thắc mắc ra huyết trắng nhiều là sắp có kinh hay có thai, đặc biệt khi nhận thấy vùng kín ẩm ướt và khí hư thay đổi bất thường. Thực tế, đây có thể là dấu hiệu sinh lý bình thường hoặc cảnh báo thai kỳ, nhưng cũng không loại trừ khả năng tiềm ẩn bệnh lý phụ khoa. Hiểu rõ những đặc điểm của khí hư trong từng trường hợp sẽ giúp bạn chủ động theo dõi và chăm sóc sức khỏe tốt hơn.

Ra huyết trắng nhiều là sắp có kinh hay có thai?
Hiện tượng ra huyết trắng nhiều có thể là dấu hiệu bình thường trong chu kỳ sinh lý, xuất hiện ở giai đoạn trứng rụng, trước kỳ kinh hoặc khi mang thai. Tuy nhiên, để trả lời chính xác ra huyết trắng nhiều là sắp có kinh hay có thai, cần xem xét thời điểm, tính chất khí hư cũng như các triệu chứng đi kèm.

Theo Mayo Clinic, trước kỳ kinh nguyệt, hormone estrogen tăng cao, làm tăng tiết dịch âm đạo. Khí hư thường ra nhiều và đặc hơn bình thường. Trong khi đó, ở những tuần đầu mang thai, nồng độ estrogen cùng lưu lượng máu tăng khiến khí hư có màu trắng sữa, loãng và ra nhiều hơn.',
N'Ra huyết trắng nhiều là sắp có kinh hay có thai là băn khoăn phổ biến ở nhiều chị em, nhất là những người đang mong có em bé hoặc quan tâm tới sức khỏe sinh sản. Bài viết dưới đây sẽ giúp bạn nhận diện đúng dấu hiệu của cơ thể, phân biệt khí hư sinh lý khi sắp có kinh hoặc khi mang thai, đồng thời lưu ý cách chăm sóc phù hợp.',
14, '2025-07-24', N'Sức khỏe', 1),

(N'Tinh trùng dị dạng có thụ thai được không? Cách tăng khả năng thụ thai',
N'Tinh trùng dị dạng là một trong những nguyên nhân phổ biến ảnh hưởng đến khả năng sinh sản nam giới, làm dấy lên lo ngại về khả năng thụ thai tự nhiên. Liệu có phải tất cả các trường hợp tinh trùng có hình dạng bất thường đều dẫn đến vô sinh? Bài viết sau sẽ giúp bạn hiểu rõ tinh trùng dị dạng có thụ thai được không và làm thế nào để tăng khả năng thụ thai.

Tinh trùng dị dạng có con được không?
Tinh trùng dị dạng vẫn có thể có con nếu tỷ lệ ≥ 4% tinh trùng bình thường và các chỉ số khác như số lượng, di động, tỷ lệ sống đạt chuẩn. Trường hợp dị dạng nặng, hỗ trợ sinh sản như IUI, IVF, ICSI có thể tăng khả năng thụ thai. Không đồng nghĩa vô sinh tuyệt đối.

Với thắc mắc này, câu trả lời là trong nhiều trường hợp, nam giới có tinh trùng dị dạng vẫn có thể thụ thai tự nhiên nếu các yếu tố khác của tinh dịch đồ đạt mức bình thường.

Trường hợp vẫn có thể thụ thai tự nhiên
Theo Tổ chức Y tế Thế giới (WHO, 2021), tỷ lệ tinh trùng có hình dạng bình thường từ 4% trở lên vẫn được coi là có khả năng sinh sản bình thường. Điều đó có nghĩa là dù có đến 96% tinh trùng dị dạng, nam giới vẫn có thể có con tự nhiên, miễn là số tinh trùng còn lại đủ khỏe mạnh để thực hiện chức năng thụ tinh.

Trong trường hợp tỷ lệ tinh trùng bình thường dưới 4%, bác sĩ sẽ đánh giá thêm các chỉ số quan trọng khác như: Tổng số lượng tinh trùng trong mỗi lần xuất tinh, mật độ tinh trùng (số lượng/ml), khả năng di động của tinh trùng, tỷ lệ sống của tinh trùng. Nếu tổng số lượng tinh trùng vẫn cao, di động tốt và vẫn còn một phần nhỏ tinh trùng có hình dạng bình thường thì khả năng thụ thai tự nhiên vẫn hoàn toàn có thể xảy ra.',
N'Tinh trùng dị dạng là chẩn đoán khiến nhiều nam giới lo lắng về khả năng sinh sản. Liệu tinh trùng dị dạng có thụ thai được không hay cần can thiệp y học? Bài viết dưới đây sẽ giúp bạn có câu trả lời cụ thể và giải pháp giúp tăng khả năng thụ thai.',
13, '2025-07-24', N'Sức khỏe', 1),

(N'Thai 17 tuần là mấy tháng? Kích thước phát triển và những điều cần lưu ý',
N'Mang thai là một hành trình kỳ diệu và mỗi tuần trôi qua đều đánh dấu những cột mốc phát triển quan trọng của thai nhi và những thay đổi đáng kể trên cơ thể người mẹ. Tuần thai thứ 17 là một giai đoạn đặc biệt, khi thai nhi bắt đầu phát triển mạnh mẽ hơn và mẹ bầu cảm nhận rõ rệt những biến đổi trong cơ thể. Vậy thai 17 tuần là mấy tháng? Thai nhi phát triển như thế nào và mẹ bầu cần lưu ý những gì? Bài viết này sẽ cung cấp thông tin để giúp bạn hiểu rõ hơn về giai đoạn này nhé!

Mang thai 17 tuần là mấy tháng?
Thông thường, việc tính tuổi thai thường dựa trên số tuần. Ở giai đoạn thai 17 tuần tuổi, mẹ bầu đang ở tháng thứ 5 của thai kỳ và cụ thể là 4 tháng 1 tuần.

Cách tính này dựa trên quy ước rằng một tháng thai kỳ trung bình kéo dài khoảng 4 tuần. Tuy nhiên, do mỗi tháng có số ngày khác nhau nên việc xác định chính xác "mấy tháng" thường có tỷ lệ chênh lệch. Đây là thời điểm thai nhi đang phát triển nhanh chóng cả về kích thước lẫn chức năng cơ thể.',
N'Mang thai 17 tuần là mấy tháng? Thai nhi phát triển ra sao và mẹ bầu cần lưu ý những gì? Để giúp mẹ hiểu rõ hơn về những thay đổi trong giai đoạn này, mời bạn đọc cùng tham khảo chi tiết trên bài viết dưới đây nhé!',
12, '2025-07-24', N'Sức khỏe', 1);



 --Blogimage-=====================================================================================================================================================
INSERT INTO dbo.BlogImage (BlogID, ImagePath, ImageCaption, UploadDate, OrderIndex )
VALUES
(1, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753344576/o4kcuxxv1mf629iinhed.webp', 'Thumbnail', '2025-07-24 08:09:40.870', 1),
(2, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753344630/htnjucs7cjbnumgy4dgo.webp', 'Thumbnail', '2025-07-24 08:10:32.053', 1),
(3, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753344715/d6jbyy2cobzxss18lqcn.webp', 'Thumbnail', '2025-07-24 08:11:56.803', 1),
(4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753344771/ff0wyvh6d0lsin7k1kev.jpg', 'Thumbnail', '2025-07-24 08:12:53.853', 1),
(5, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753344804/j4p7imkblv58djsjub5z.webp', 'Thumbnail', '2025-07-24 08:13:26.433', 1),
(6, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753337275/fpwfwngwgvxpivb9fw5c.webp', N'Thumbnail', '2025-07-24 06:08:35.987', 1),
(7, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753337660/chyrelwrjc3oftqtjf3m.webp', N'Thumbnail', '2025-07-24 06:14:22.297', 1),
(8, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753337727/rynj3t2cf4gruufjwjjo.webp', N'Thumbnail', '2025-07-24 06:15:34.137', 1),
(9, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1753337798/ttwqad9lzrlmbngkfmgs.webp', N'Thumbnail', '2025-07-24 06:16:40.273', 1);

--Blogview -=====================================================================================================================================================
INSERT INTO dbo.BlogView (MemberID, BlogID, ViewDate)
VALUES
(10, 1, '2025-06-26 13:21:41.863'),
(10, 2, '2025-06-26 13:21:41.863'),
(NULL, 3, '2025-07-01 13:29:37.860'),
(NULL, 1, '2025-07-01 13:29:37.967'),
(NULL, 2, '2025-07-01 15:03:52.057'),
(NULL, 3, '2025-07-01 15:05:08.526'),
(NULL, 5, '2025-07-01 15:05:08.563'),
(NULL, 1, '2025-07-01 15:05:08.573'),
(NULL, 2, '2025-07-01 15:05:08.597'),
(NULL, 3, '2025-07-01 15:34:53.640'),
(NULL, 5, '2025-07-01 15:34:53.640'),
(NULL, 4, '2025-07-01 15:34:53.640'),
(NULL, 1, '2025-07-08 12:06:37.037'),
(NULL, 1, '2025-07-08 12:07:16.987'),
(NULL, 1, '2025-07-08 12:07:38.087'),
(NULL, 1, '2025-07-08 12:08:04.087'),
(NULL, 1, '2025-07-08 12:08:36.060'),
(NULL, 1, '2025-07-08 12:10:43.747'),
(NULL, 1, '2025-07-08 12:11:03.747'),
(NULL, 1, '2025-07-08 12:11:13.747'),
(NULL, 1, '2025-07-08 12:11:23.090');


--=====================================================================================================================================================
--ReproductiveCycle

INSERT INTO dbo.ReproductiveCycle (MemberID, StartDate, CycleLength, PeriodLength, PillTime, LastUpdated)
VALUES
(16, '2025-03-10', 28, 5, '07:00:00', '2025-03-10 08:00:00'),
(16, '2025-04-07', 28, 5, '07:00:00', '2025-04-07 08:00:00'),
(16, '2025-05-05', 28, 5, '07:00:00', '2025-05-05 08:00:00'),
(16, '2025-06-02', 28, 5, '07:00:00', '2025-06-02 08:00:00'),
(16, '2025-06-30', 28, 5, '07:00:00', '2025-06-30 08:00:00'),

-- Member 17 - 3 chu kỳ
(17, '2025-04-01', 30, 6, NULL, '2025-04-01 09:00:00'),
(17, '2025-05-01', 30, 6, NULL, '2025-05-01 09:00:00'),
(17, '2025-05-31', 30, 6, NULL, '2025-05-31 09:00:00'),

-- Member 18 - 4 chu kỳ
(18, '2025-03-20', 29, 5, NULL, '2025-03-20 10:00:00'),
(18, '2025-04-18', 29, 5, NULL, '2025-04-18 10:00:00'),
(18, '2025-05-17', 29, 5, NULL, '2025-05-17 10:00:00'),
(18, '2025-06-15', 29, 5, NULL, '2025-06-15 10:00:00'),

-- Member 19 - 2 chu kỳ
(19, '2025-05-05', 27, 4, '21:00:00', '2025-05-05 07:45:00'),
(19, '2025-06-01', 27, 4, '21:00:00', '2025-06-01 07:45:00'),

-- Member 20 - 5 chu kỳ
(20, '2025-02-15', 30, 7, NULL, '2025-02-15 08:30:00'),
(20, '2025-03-17', 30, 7, NULL, '2025-03-17 08:30:00'),
(20, '2025-04-16', 30, 7, NULL, '2025-04-16 08:30:00'),
(20, '2025-05-16', 30, 7, NULL, '2025-05-16 08:30:00'),
(20, '2025-06-15', 30, 7, NULL, '2025-06-15 08:30:00');


--=====================================================================================================================================================
--ReportServiceDetail

INSERT INTO dbo.ReportServiceDetail (ReportPeriod, ServiceID, UsageCount, AvgRating, TotalRevenue, CreatedAt)
VALUES
-- Tháng 5/2025
('2025-05', 1, 25, 4.6, 25000000, '2025-06-01 08:00:00'),
('2025-05', 2, 12, 4.8, 1800000, '2025-06-01 08:00:00'),

-- Tháng 6/2025
('2025-06', 1, 32, 4.7, 32000000, '2025-07-01 08:00:00'),
('2025-06', 2, 15, 4.9, 2250000, '2025-07-01 08:00:00'),

-- Tháng 7/2025 (giữa tháng nên chưa nhiều)
('2025-07', 1, 10, 4.5, 10000000, '2025-07-09 08:00:00'),
('2025-07', 2, 5, 4.6, 750000, '2025-07-09 08:00:00');



--=====================================================================================================================================================
--feedback
INSERT INTO Feedback (AppointmentID, RecordID, Rating, Comment, FeedbackDate)
VALUES
(1, NULL, 5,  N'dịch vụ rất tốt', GETDATE()),
(2, NULL, 5,  N'dịch vụ rất tốt', GETDATE()),
(NULL, 1, 5,  N'Bác sĩ rất tận tâm ạ', GETDATE()),
(NULL, 2, 5,  N'Dịch vụ rất tốt', GETDATE());


--Table [dbo].[Notification]
INSERT INTO dbo.Notification (UserID, Title, Content, SendTime, IsRead)
VALUES
(18, N'Thông báo hệ thống', N'Hệ thống sẽ bảo trì lúc 23:00 đêm nay.', '2025-06-26 13:21:41.863', 0),
(18, N'Xác nhận email', N'Vui lòng xác nhận email để tiếp tục sử dụng dịch vụ.', '2025-06-26 13:21:41.863', 0),
(13, N'Cập nhật hồ sơ', N'Hồ sơ của bạn đã được cập nhật thành công.', '2025-06-26 13:21:41.863', 1),
(10, N'Thông báo thanh toán', N'Giao dịch #TX2931 đã được xác nhận.', '2025-06-26 13:21:41.863', 0),
(13, N'Mật khẩu đã thay đổi', N'Bạn vừa thay đổi mật khẩu thành công.', '2025-06-26 13:21:41.863', 1),
(11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:18:42.367', 0),
(12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:19:21.720', 0),
(18, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:19:50.697', 0),
(11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-30 22:52:07.173', 0),
(10, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-30 23:31:56.720', 1),
(10, N'Đặt lịch xét nghiệm thành công', N'Bạn đã đặt lịch xét nghiệm thành công. Mã phiếu: 5', '2025-06-30 16:31:58.967', 1),
(18, NULL, N'Bạn có một câu hỏi mới từ 10', '2025-07-01 08:06:46.830', 0),
(10, NULL, N'Câu hỏi của bạn đã được gửi thành công và sẽ sớm được trả lời.', '2025-07-01 08:06:46.830', 1),
(10, NULL, N'Bạn đã đặt câu hỏi thành công yêu em', '2025-07-01 08:07:16.803', 1),
(18, NULL, N'Bạn có một câu hỏi mới từ yêu em', '2025-07-01 08:07:16.803', 0),
(11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:50:15.200', 0),
(12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:50:53.430', 0),
(11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:51:57.657', 0),
(12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:52:24.243', 0),
(11, N'Hủy xét nghiệm', N'Xét nghiệm của bạn đã được hủy.', '2025-07-03 16:23:55.060', 0),
(12, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:03:50.460', 1),
(11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:04:16.613', 0),
(11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:04:58.397', 1),
(11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-04 22:20:48.333', 1),
(10, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-04 22:22:06.243', 1),
(10, N'Đặt lịch xét nghiệm thành công', N'Bạn đã đặt lịch xét nghiệm thành công. Mã phiếu: 12', '2025-07-04 15:22:07.140', 0),
(18, N'Lịch làm việc', N'Bạn có lịch làm việc mới ,kiểm tra lịch làm việc ngay nhé', '2025-07-06 01:48:34.343', 0),
(13, N'Cập nhật lịch làm việc', N'Lịch làm việc Thứ 3 ca ca sáng đã được xóa khỏi lịch làm việc thường xuyên của bạn.', '2025-07-06 16:12:36.383', 1),
(18, N'Lịch làm việc mới', N'Bạn đã được thêm vào lịch làm việc thường xuyên: Thứ 7 ca Chiều (13:00 - 17:00). Vui lòng kiểm tra và xác nhận lịch làm việc của bạn.', '2025-07-06 16:13:36.467', 0),
(18, N'Cập nhật lịch làm việc', N'Lịch làm việc của bạn đã được cập nhật: Thứ 7 ca sáng (08:00 - 12:00). Vui lòng kiểm tra ở mục lịch làm việc của bạn.', '2025-07-06 16:48:57.497', 0),
(18, N'Cập nhật lịch làm việc', N'Lịch làm việc của bạn đã được cập nhật: Thứ 7 ca chiều (13:00 - 17:00). Vui lòng kiểm tra ở mục lịch làm việc của bạn.', '2025-07-06 16:49:24.997', 0);


INSERT INTO dbo.Invoice (
    AppointmentID, TestServiceRecordID, TotalAmount, PaymentMethod,
    TransactionId, CreatedAt, Status, TaxRate, UnitPrice, PaidAt
)
VALUES
(1, NULL, 157500.00, 'PayPal', '7AB12345JK987654L', '2025-07-24 13:00:01.000', 1, 0.05, 'VND', '2025-07-24 13:00:01.000'),
(2, NULL, 157500.00, 'PayPal', '6CD23456LM876543M', '2025-07-24 13:01:01.000', 1, 0.05, 'VND', '2025-07-24 13:01:01.000'),
(3, NULL, 157500.00, 'PayPal', '8EF34567NO765432N', '2025-07-24 13:02:01.000', 1, 0.05, 'VND', '2025-07-24 13:02:01.000'),
(4, NULL, 157500.00, 'PayPal', '9GH45678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000'),
(5, NULL, 157500.00, 'PayPal', '1IJ56789RS543210R', '2025-07-24 13:04:01.000', 1, 0.05, 'VND', '2025-07-24 13:04:01.000'),
(6, NULL, 157500.00, 'PayPal', '2KL67890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(7, NULL, 157500.00, 'PayPal', '7AB12345JK987654L', '2025-07-24 13:00:01.000', 1, 0.05, 'VND', '2025-07-24 13:00:01.000'),
(8, NULL, 157500.00, 'PayPal', '6CD23456LM876543M', '2025-07-24 13:01:01.000', 1, 0.05, 'VND', '2025-07-24 13:01:01.000'),
(9, NULL, 157500.00, 'PayPal', 'K9876567NO765432N', '2025-07-24 13:02:01.000', 1, 0.05, 'VND', '2025-07-24 13:02:01.000'),
(10, NULL, 157500.00, 'PayPal', 'NO765678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000'),
(11, NULL, 157500.00, 'PayPal', 'IJ566789RS543210R', '2025-07-24 13:04:01.000', 1, 0.05, 'VND', '2025-07-24 13:04:01.000'),
(12, NULL, 157500.00, 'PayPal', '2IJ57890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(13, NULL, 157500.00, 'PayPal', '9GH45678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000'),
(14, NULL, 157500.00, 'PayPal', '1IJ56789RS543210R', '2025-07-24 13:04:01.000', 1, 0.05, 'VND', '2025-07-24 13:04:01.000'),
(15, NULL, 157500.00, 'PayPal', 'Q6547890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(16, NULL, 157500.00, 'PayPal', '45J45678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000'),
(17, NULL, 157500.00, 'PayPal', '1IJ56789RS543210R', '2025-07-24 13:04:01.000', 1, 0.05, 'VND', '2025-07-24 13:04:01.000'),
(18, NULL, 157500.00, 'PayPal', '2KL67890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(19, NULL, 157500.00, 'PayPal', 'TU445678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000'),
(20, NULL, 157500.00, 'PayPal', '09T56789RS543210R', '2025-07-24 13:04:01.000', 1, 0.05, 'VND', '2025-07-24 13:04:01.000'),
(21, NULL, 157500.00, 'PayPal', '21P67890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(22, NULL, 157500.00, 'PayPal', '9GH45678PQ654321P', '2025-07-24 13:03:01.000', 1, 0.05, 'VND', '2025-07-24 13:03:01.000');

INSERT INTO dbo.Invoice (
    AppointmentID, TestServiceRecordID, TotalAmount, PaymentMethod,
    TransactionId, CreatedAt, Status, TaxRate, UnitPrice, PaidAt
)
VALUES
(NULL, 3, 1050000.00, 'PayPal', '9B766355RJ45471925', '2025-07-14 10:01:36.937', 1, 0.05, 'VND', '2025-07-14 13:34:59.577'),
(NULL, 4, 1050000.00, 'PayPal', '6IW823322B527477M', '2025-07-14 13:34:59.577', 1, 0.05, 'VND', '2025-07-14 13:34:59.577'),
(NULL, 5, 1050000.00, 'PayPal', '1BD76296U803490K', '2025-07-16 16:42:49.443', 1, 0.05, 'VND', '2025-07-16 16:42:49.443'),
(NULL, 6, 1050000.00, 'PayPal', '8YX5658U74173812T', '2025-07-19 15:56:32.380', 1, 0.05, 'VND', '2025-07-19 15:56:32.380'),
(NULL, 7, 1050000.00, 'PayPal', '3VB8217R1S160237B', '2025-07-22 16:40:07.407', 1, 0.05, 'VND', '2025-07-22 16:40:07.407'),
(NULL, 1, 1050000.00, 'PayPal', '6F077593P0139692R', '2025-07-22 17:02:30.653', 1, 0.05, 'VND', '2025-07-22 17:02:30.653'),
(NULL, 2, 1050000.00, 'PayPal', '3VB8217R1S160237B', '2025-07-22 16:40:07.407', 1, 0.05, 'VND', '2025-07-22 16:40:07.407'),
(NULL, 12, 1050000.00, 'PayPal', '4F077593P0139692R', '2025-07-22 17:02:30.653', 1, 0.05, 'VND', '2025-07-22 17:02:30.653'),
(NULL, 13, 1050000.00, 'PayPal', '46627614SJ2608229', '2025-07-24 02:14:26.793', 1, 0.05, 'VND', '2025-07-24 02:14:26.793');


--WeeklySchedule--=====================================================================================================================================================
-- Staff (UserID = 3, 6) works morning shift from Mon to Fri
INSERT INTO [WeeklySchedules] (UserId, DayOfWeek, StartTime, EndTime, ShiftType, Note)
VALUES
(3, 1, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 2, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 3, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 4, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 3, 5, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 6, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 3, 0, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 0, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 1, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 2, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 3, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 4, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(6, 5, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 6, 6, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 7, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
(7, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 7, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 7, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 7, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 7, 5, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 8, 5, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 9, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 9, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 9, 5, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 9, 6, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
(4, 1, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),--Staff
(4, 2, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(4, 3, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(4, 4, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 11, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL), 
( 11, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),   --lichj cho CS Pham thi F
( 11, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 11, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 11, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 5, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 5, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),--CS
( 5, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 5, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 5, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 12, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 12, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 12, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 12, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 12, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 13, 0, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 13, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 13, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 13, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 13, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 14, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 14, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 14, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 14, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 15, 1, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 15, 2, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 15, 3, '13:00:00.0000000', '17:00:00.0000000', 2, NULL),
( 15, 4, '13:00:00.0000000', '17:00:00.0000000', 2, NULL);



--WeeklyOverrideSchedule--=====================================================================================================================================================
INSERT INTO dbo.WeeklyOverrideSchedules (UserId, Date, OverrideType, Reason, ShiftType, Status)
VALUES
(3, '2025-07-30 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(5, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(6, '2025-07-01 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(6, '2025-06-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(6, '2025-07-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(5, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(10, '2025-07-04 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(3, '2025-07-05 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã xác nhận'),
(5, '2025-07-31 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(3, '2025-07-30 00:00:00.0000000', N'Làm thêm', N'', 2, N'Đang chờ duyệt'),
(10, '2025-07-29 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt');
