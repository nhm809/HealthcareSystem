use [HealthcareSystemDb]

--Role --=====================================================================================================================================================
INSERT INTO [Role] ([RoleID], [RoleName], [RoleDescription]) VALUES
('AD', 'Admin', N'Quản trị viên toàn hệ thống'),
('MG', 'Manager', N'Quản lý người dùng và dịch vụ'),
('ST', 'Staff', N'Bác sĩ/tư vấn viên thực hiện chẩn đoán'),
('CS', 'Consultant', N'Nhân viên tư vấn'),  --
('MB', 'Member', N'Thành viên/khách hàng sử dụng dịch vụ');


INSERT INTO dbo.[User] (Provider, GoogleId, FullName, PasswordHash, Email, PhoneNumber, DoB, Gender, Address, CreateDate, Avatar, RoleID, RefreshToken, RefreshTokenExpiryTime, IsAvailable)
VALUES
('Local', NULL, N'Nguyễn Hữu Mỹ', '$2b$12$Pxl1ujUjOPYdRWjahaiX5.T5dGh32eIsLim6cS9qxbZCdRM2Moa5K', 'mexnguyen894@gmail.com', '0979298904', '1990-09-08', 'MALE', N'Quận 9, TP. Thủ Đức, TP.HCM', GETDATE(), NULL, 'AD', NULL, NULL, 1),
('Local', NULL, N'Tống Ngọc Anh Tài', '$2b$12$3HxIeXlkXQ3IeQ/DElsoEuHIDIsMAAGe6EdWthucDyXVUltWEE3hu', 'taitongngocanh@gmail.com', '0900000001', '1990-01-01', 'MALE', N'Quận 1, TP.HCM', GETDATE(), NULL, 'MG', NULL, NULL, 1),
('Local', NULL, N'Phạm Nguyễn Đăng Hải', '$2b$12$hjtLyni3G0HRc2ZW80Pqy.iehAis/gEXgwFM90QxoZ5.SeXFQlAPy', 'pndhai@gmail.com', '0900000002', '1990-01-01', 'MALE', N'Quận 3, TP.HCM', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn Hiếu', '$2b$12$c/AAkCxOXWR3NV9eoTuYZux5omogNoyNn/kwIfw8cCJzm51F.08Km', 'hieubmk2210@gmail.com', '0900000003', '1990-01-01', 'MALE', N'Quận 5, TP.HCM', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Trọng Tốt', '$2b$12$S3vJka0JR7z/6nQzCWggZ.xepI5V35EwsA9qhKpM5lRRxINuD8KMe', 'totn786@gmail.com', '0900000004', '1990-01-01', 'MALE', N'Quận 7, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),

('Local', NULL, N'Phạm Văn A', '$2b$12$3cp8.Ow3.K9IcQ755h/AQemjyo3HvJihF1t1DnkE/SrkvvgXJ98V6', 'st1@gmail.com', '0900000005', '1990-01-01', 'MALE', N'Ba Đình, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Thị B', '$2b$12$Z3t4PM.cwdj15n7WE4iukOKCpX64O2xiJrYw/yNnZwPtu/id7Ulqy', 'st2@gmail.com', '0900000006', '1990-01-01', 'FEMALE', N'Cầu Giấy, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Lê Văn C', '$2b$12$89QkxPonD5JMDU.1huUGGu1BozLmOwUNKmoAJPJF1llv7hInR5CO2', 'st3@gmail.com', '0900000007', '1990-01-01', 'MALE', N'Đống Đa, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Trần Thị D', '$2b$12$mYXj/4b3m0aO1UrTcU16DudS/NlzY2HKnnlzcj3JBq5k6eTgSMw4.', 'st4@gmail.com', '0900000008', '1990-01-01', 'FEMALE', N'Tây Hồ, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Đỗ Văn E', '$2b$12$HMoag.2c2xwHEvF/mHNRl.gMTILC0UiTXg9ktP2Zr7w9argdcVAVa', 'st5@gmail.com', '0900000009', '1990-01-01', 'MALE', N'Thanh Xuân, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),

('Local', NULL, N'Phạm Thị F', '$2b$12$wSZBfgrmVSrLZ2bdQF06u.nDqlpw0XSsQGMP4IDKqmm0HCV8tlp76', 'cs1@gmail.com', '0900000011', '1990-01-01', 'FEMALE', N'Tân Bình, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn G', '$2b$12$MbuVCH/y24/h32Ur0CHspui1EFCoGhPb0xmP3FMVAlRuyp.VYARDi', 'cs2@gmail.com', '0900000012', '1990-01-01', 'MALE', N'Gò Vấp, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Trần Thị H', '$2b$12$EcD9DhEhG/UWS1ZSdvojFOVU6abjJkiCDkKiYBKUtRuxFpW20CoYa', 'cs3@gmail.com', '0900000013', '1990-01-01', 'FEMALE', N'Phú Nhuận, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Lê Văn I', '$2b$12$5PsH27XHdXMQHOCKIDTdeeRUAMXpdBUQlIOsjTKFSGnEqLXSUSLTG', 'cs4@gmail.com', '0900000014', '1990-01-01', 'MALE', N'Thủ Đức, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),
('Local', NULL, N'Đỗ Thị K', '$2b$12$GGkIhoYhz8Q3i.Ngj.qVb.uvSMgjAiY1.L.YJp84mcp..P80.c4ti', 'cs5@gmail.com', '0900000015', '1990-01-01', 'FEMALE', N'Bình Thạnh, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),

('Local', NULL, N'Phạm Văn L', '$2b$12$3ImHvmrpcTZ4pmSuFGJ3Tu2z2eQwDdRd3Drl2mDrUZOu0CyaOEqPW', 'mb1@gmail.com', '0900000021', '1990-01-01', 'MALE', N'Hải Châu, Đà Nẵng', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Thị M', '$2b$12$.TjUlnCV5kveIaB3HqndC.LGh9Oe1b.DLkGL7GPAv9NIm2Fc2DNQu', 'mb2@gmail.com', '0900000022', '1990-01-01', 'FEMALE', N'Thanh Khê, Đà Nẵng', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Trần Văn N', '$2b$12$P0BM/UixRPRcpzQPmBE1Au4LrHlfXInJAZzT82GoN2SQQTO6WNP0K', 'mb3@gmail.com', '0900000023', '1990-01-01', 'MALE', N'Sơn Trà, Đà Nẵng', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Lê Thị O', '$2b$12$TO7pN0Mv2WwYf3OO/cFsjOZUDHqL2IesQvgYIBzkdDjbLaSgF6avi', 'mb4@gmail.com', '0900000024', '1990-01-01', 'FEMALE', N'Ngũ Hành Sơn, Đà Nẵng', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Đỗ Văn P', '$2b$12$BFKrN3o41xu0qzFHrUQURO/k8HWnLJbvgGDZyw.HStDg4dB0yysC.', 'mb5@gmail.com', '0900000025', '1990-01-01', 'MALE', N'Liên Chiểu, Đà Nẵng', GETDATE(), NULL, 'MB', NULL, NULL, 1);



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
(N'Tư vấn sức khỏe sinh sản', N'Tư vấn 1:1 với chuyên gia về sức khỏe sinh sản.', 150000)


--[UserSpecialty]--=====================================================================================================================================================
INSERT INTO dbo.UserSpecialty (UserID, SpecialtyID)
VALUES
-- Phạm Nguyễn Đăng Hải (ST)
(3, 1),  -- Sản Phụ Khoa
(3, 2),  -- Nam Khoa

-- Nguyễn Trọng Tốt (CS)
(5, 3),  -- Da liễu - STIs
(5, 8),  -- Xét nghiệm y khoa

-- Các ST khác
(6, 5),  -- Y học tổng quát
(6, 8),  -- Xét nghiệm y khoa

(7, 1),  -- Sản Phụ Khoa
(7, 5),  -- Y học tổng quát

(8, 2),  -- Nam Khoa
(8, 5),  -- Y học tổng quát

(9, 5),  -- Y học tổng quát
(9, 6),  -- Dược học

(10, 5), -- Y học tổng quát
(10, 7), -- Giáo dục giới tính

-- Các CS khác
(11, 3), -- Da liễu - STIs
(11, 6), -- Dược học

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
(16, 'https://meet.google.com/abc-defg-hij', 2, 5, '2025-07-23 14:00:00.000', '2025-07-23 14:30:00.000', N'Da hoan thanh', N'Tư vấn tâm lý'),
(16, 'https://meet.google.com/bcd-efgh-ijk', 2, 5, '2025-07-24 13:00:00.000', '2025-07-24 13:30:00.000', N'Dang cho kham', N'Cảm thấy khó chịu ở vùng ngực'),

(17, 'https://meet.google.com/lmn-opqr-stu', 2, 6, '2025-07-26 09:00:00.000', '2025-07-26 09:30:00.000', N'Dang cho kham', N'Gặp vấn đề về sức khỏe sau kỳ rụng dâu'),

(18, 'https://meet.google.com/rst-uvwx-yza', 2, 5, '2025-07-27 10:00:00.000', '2025-07-27 10:30:00.000', N'Dang cho kham', N'Vấn đề liên quan đến rụng trứng'),
(19, 'https://meet.google.com/vwx-yzab-cde', 2, 5, '2025-07-24 15:30:00.000', '2025-07-24 16:00:00.000', N'Dang thanh toan', N'Khó ngủ'),
(19, 'https://meet.google.com/fgh-ijkl-mno', 2, 15, '2025-07-26 14:30:00.000', '2025-07-26 15:00:00.000', N'Da huy', N'Tôi cần tư vấn tâm lý sau khi sinh'),

(20, 'https://meet.google.com/ghi-jklm-nop', 1, 14, '2025-07-17 15:00:00.000', '2025-07-17 15:30:00.000', N'Da danh gia', N'Tư vấn tâm lý'),
(20, 'https://meet.google.com/zab-cdef-ghi', 2, 14, '2025-07-25 15:00:00.000', '2025-07-25 15:30:00.000', N'Dang cho kham', N'Giáo dục giới tính'),
(20, 'https://meet.google.com/pqr-stuv-wxy', 2, 14, '2025-07-26 16:00:00.000', '2025-07-26 16:30:00.000', N'Dang cho kham', N'Tôi cần tư vấn tâm lý sau khi sinh');




--TestServiceRecord --=====================================================================================================================================================
INSERT INTO TestServiceRecord (
    ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember,
    MemberID, Result, StaffID, RecordDate, TestDate,
    TimeSlot, Notes, Status
)
VALUES
-- ID 6
(1, '1990-01-01', N'MALE', '0900000021', N'Phạm Văn L',
 16, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752463186/aq4lk1js0gofqlvsbqlp.jpg', 3, '2025-07-03 13:49:14.260',
 '2025-07-06', '08:00:00.0000000', N'đã hoàn thành xét nghiệm', N'Da danh gia'),

-- ID 11
(1, '1990-01-01', N'MALE', '0900000021', N'Phạm Văn L',
 16, NULL, NULL, '2025-07-03 16:23:58.023',
 '2025-07-03', '08:00:00.0000000', NULL, N'Dang thanh toan'),

-- ID 13
(1, '2004-04-06', N'MALE', '0975672459', N'Nguyễn Văn Hiếu',
 4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752915543/mvszssp7fpthqweeh51i.jpg', 3, '2025-07-14 10:01:17.480',
 '2025-07-15', '08:00:00.0000000', NULL, N'Da hoan thanh'),

-- ID 19
(1, '2002-04-08', N'MALE', '0975672457', N'Nguyễn Văn Hiếu',
 4, NULL, NULL, '2025-07-24 02:09:00.227',
 '2025-08-01', '08:00:00.0000000', NULL, N'Da huy'),

-- ID 20
(1, '2002-01-02', N'MALE', '0377681234', N'Đỗ Văn L',
 20, NULL, NULL, '2025-07-24 02:11:41.433',
 '2025-07-31', '13:00:00.0000000', NULL, N'Da huy'),

-- ID 21
(1, '2002-05-01', N'FEMALE', '0376782657', N'Nguyễn Thị Mai',
 16, NULL, 7, '2025-07-24 02:14:12.787',
 '2025-07-31', '13:00:00.0000000', NULL, N'Dang cho kham'),

-- ID 22
(1, '1990-08-08', N'MALE', '0975672123', N'Trần Văn Nguyên',
 18, NULL, 3, '2025-07-24 02:21:54.470',
 '2025-07-24', '08:00:00.0000000', N'Mẫu xét nghiệm đang trong quá trình phân tích', N'Dang thuc hien'),

 (1, '2002-04-09', N'MALE', '0931231233', N'Nguyễn Nhật Minh',
 19, NULL, 3, '2025-07-24 02:36:00.923',
 '2025-07-30', '08:00:00.0000000', NULL, N'Dang cho kham'),

(1, '2001-03-05', N'MALE', '0371234567', N'Lê Văn Tài',
 17, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1752918765/sample_result1.jpg', 7, '2025-07-24 10:00:00.000',
 '2025-08-01', '08:00:00.0000000', N'Xét nghiệm thành công', N'Da danh gia'),

-- ID 24: Đang thực hiện
(1, '2000-12-12', N'FEMALE', '0369876543', N'Trần Thị Bình',
 20, NULL, 6, '2025-07-24 11:00:00.000',
 '2025-08-02', '13:00:00.0000000', N'Đang lấy mẫu xét nghiệm', N'Dang thuc hien');

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
(N'Cách theo dõi chu kỳ kinh nguyệt và nhận biết thời gian rụng trứng',
 N'Nắm rõ chu kỳ kinh nguyệt giúp bạn dự đoán thời gian rụng trứng và khả năng mang thai. Trong bài viết này, chúng tôi hướng dẫn bạn cách theo dõi và sử dụng công cụ tính chu kỳ hiệu quả.',
 N'Hướng dẫn theo dõi chu kỳ kinh nguyệt để nhận biết thời điểm rụng trứng và tránh thai tự nhiên.',
 14, '2025-05-20', N'Sức khỏe', 1),

(N'Những điều cần biết về các bệnh lây truyền qua đường tình dục (STIs)',
 N'STIs là các bệnh nguy hiểm có thể ảnh hưởng đến sức khỏe sinh sản và cuộc sống tình dục. Bài viết giúp bạn hiểu rõ về dấu hiệu, cách phòng ngừa và thời điểm cần xét nghiệm.',
 N'Hiểu đúng về STIs – dấu hiệu, cách lây và phòng ngừa hiệu quả.',
 14, '2025-05-18', N'STIs', 1),

(N'Thuốc tránh thai: Cách dùng đúng và những lưu ý quan trọng',
 N'Không chỉ uống đúng giờ, người dùng thuốc tránh thai còn cần lưu ý nhiều điều khác để đảm bảo hiệu quả tránh thai. Bài viết giải đáp chi tiết những thắc mắc thường gặp.',
 N'Giải đáp mọi thắc mắc về việc sử dụng thuốc tránh thai an toàn và hiệu quả.',
 13, '2025-05-15', N'Sức khỏe', 1),

(N'Lần đầu đi xét nghiệm STIs – Cần chuẩn bị gì?',
 N'Nhiều người lo lắng hoặc ngại ngùng khi đi xét nghiệm STIs. Bài viết chia sẻ quy trình, những điều cần chuẩn bị và cách lấy kết quả an toàn, bảo mật.',
 N'Chuẩn bị tâm lý và hiểu quy trình khi đi xét nghiệm STIs lần đầu.',
 15, '2025-05-12', N'Hướng dẫn', 1),

(N'Tư vấn giới tính online – Giải pháp an toàn và tiện lợi cho giới trẻ',
 N'Tư vấn giới tính trực tuyến giúp bạn giải đáp những thắc mắc nhạy cảm một cách kín đáo và nhanh chóng. Hãy tìm hiểu cách đặt lịch và trao đổi hiệu quả với chuyên gia.',
 N'Tìm hiểu cách tư vấn giới tính online và những lợi ích mang lại.',
 13, '2025-05-10', N'Tâm lý', 1),
 
 (N'Sức khỏe hệ sinh sản của nam và nữ là gì?',
N'Sức khỏe hệ sinh sản đảm bảo mọi người có một đời sống tình dục hạnh phúc và an toàn, mang khả năng sinh sản và được quyền chủ động quyết định thời gian và số lần mang thai. Sức khỏe sinh sản của nam và nữ là những khía cạnh quan trọng của hệ thống sinh sản về mặt tổng thể vì cả hai đều tham gia vào quá trình tạo ra một sinh linh mới. Vậy thì sức khỏe hệ sinh sản là gì, hãy tìm hiểu cùng MedSex nhé.

1. Sức khỏe hệ sinh sản là gì?
Theo WHO, sức khỏe hệ sinh sản là trạng thái hoàn toàn khỏe mạnh, hài hòa về thể chất, tinh thần và xã hội ở mọi khía cạnh liên quan đến hệ thống, chức năng và quá trình sinh sản trong suốt các giai đoạn của cuộc đời, chứ không đơn thuần chỉ là không có bệnh tật hoặc ốm đau. Sức khỏe sinh sản bao gồm:

- Sức khỏe thể chất: cơ thể khỏe mạnh, các cơ quan sinh dục nam, nữ không bị tổn thương và đảm bảo cho việc thực hiện chức năng tình dục và sinh sản.
- Sức khỏe tinh thần: cá nhân cảm thấy thoải mái với chính mình về sức khỏe sinh sản và tình dục, biết thừa nhận những nhược điểm, không tự ti, sống đoàn kết với mọi người.
- Sức khỏe xã hội: đảm bảo sự an toàn cho xã hội, có mối quan hệ tốt với cộng đồng.',
N'Sức khỏe hệ sinh sản đảm bảo mọi người có một đời sống tình dục hạnh phúc và an toàn, mang khả năng sinh sản và được quyền chủ động quyết định thời gian và số lần mang thai. Hãy tìm hiểu sức khỏe hệ sinh sản cùng Genetica nhé.',
11, '2025-07-24', N'Sức khỏe', 1),

(N'Ra huyết trắng nhiều là sắp có kinh hay có thai? Dấu hiệu và lời khuyên hữu ích',
N'Nhiều chị em thắc mắc ra huyết trắng nhiều là sắp có kinh hay có thai, đặc biệt khi nhận thấy vùng kín ẩm ướt và khí hư thay đổi bất thường. Thực tế, đây có thể là dấu hiệu sinh lý bình thường hoặc cảnh báo thai kỳ, nhưng cũng không loại trừ khả năng tiềm ẩn bệnh lý phụ khoa. Hiểu rõ những đặc điểm của khí hư trong từng trường hợp sẽ giúp bạn chủ động theo dõi và chăm sóc sức khỏe tốt hơn.

Ra huyết trắng nhiều là sắp có kinh hay có thai?
Hiện tượng ra huyết trắng nhiều có thể là dấu hiệu bình thường trong chu kỳ sinh lý, xuất hiện ở giai đoạn trứng rụng, trước kỳ kinh hoặc khi mang thai. Tuy nhiên, để trả lời chính xác ra huyết trắng nhiều là sắp có kinh hay có thai, cần xem xét thời điểm, tính chất khí hư cũng như các triệu chứng đi kèm.

Theo Mayo Clinic, trước kỳ kinh nguyệt, hormone estrogen tăng cao, làm tăng tiết dịch âm đạo. Khí hư thường ra nhiều và đặc hơn bình thường. Trong khi đó, ở những tuần đầu mang thai, nồng độ estrogen cùng lưu lượng máu tăng khiến khí hư có màu trắng sữa, loãng và ra nhiều hơn.',
N'Ra huyết trắng nhiều là sắp có kinh hay có thai là băn khoăn phổ biến ở nhiều chị em, nhất là những người đang mong có em bé hoặc quan tâm tới sức khỏe sinh sản. Bài viết dưới đây sẽ giúp bạn nhận diện đúng dấu hiệu của cơ thể, phân biệt khí hư sinh lý khi sắp có kinh hoặc khi mang thai, đồng thời lưu ý cách chăm sóc phù hợp.',
11, '2025-07-24', N'Sức khỏe', 1),

(N'Tinh trùng dị dạng có thụ thai được không? Cách tăng khả năng thụ thai',
N'Tinh trùng dị dạng là một trong những nguyên nhân phổ biến ảnh hưởng đến khả năng sinh sản nam giới, làm dấy lên lo ngại về khả năng thụ thai tự nhiên. Liệu có phải tất cả các trường hợp tinh trùng có hình dạng bất thường đều dẫn đến vô sinh? Bài viết sau sẽ giúp bạn hiểu rõ tinh trùng dị dạng có thụ thai được không và làm thế nào để tăng khả năng thụ thai.

Tinh trùng dị dạng có con được không?
Tinh trùng dị dạng vẫn có thể có con nếu tỷ lệ ≥ 4% tinh trùng bình thường và các chỉ số khác như số lượng, di động, tỷ lệ sống đạt chuẩn. Trường hợp dị dạng nặng, hỗ trợ sinh sản như IUI, IVF, ICSI có thể tăng khả năng thụ thai. Không đồng nghĩa vô sinh tuyệt đối.

Với thắc mắc này, câu trả lời là trong nhiều trường hợp, nam giới có tinh trùng dị dạng vẫn có thể thụ thai tự nhiên nếu các yếu tố khác của tinh dịch đồ đạt mức bình thường.

Trường hợp vẫn có thể thụ thai tự nhiên
Theo Tổ chức Y tế Thế giới (WHO, 2021), tỷ lệ tinh trùng có hình dạng bình thường từ 4% trở lên vẫn được coi là có khả năng sinh sản bình thường. Điều đó có nghĩa là dù có đến 96% tinh trùng dị dạng, nam giới vẫn có thể có con tự nhiên, miễn là số tinh trùng còn lại đủ khỏe mạnh để thực hiện chức năng thụ tinh.

Trong trường hợp tỷ lệ tinh trùng bình thường dưới 4%, bác sĩ sẽ đánh giá thêm các chỉ số quan trọng khác như: Tổng số lượng tinh trùng trong mỗi lần xuất tinh, mật độ tinh trùng (số lượng/ml), khả năng di động của tinh trùng, tỷ lệ sống của tinh trùng. Nếu tổng số lượng tinh trùng vẫn cao, di động tốt và vẫn còn một phần nhỏ tinh trùng có hình dạng bình thường thì khả năng thụ thai tự nhiên vẫn hoàn toàn có thể xảy ra.',
N'Tinh trùng dị dạng là chẩn đoán khiến nhiều nam giới lo lắng về khả năng sinh sản. Liệu tinh trùng dị dạng có thụ thai được không hay cần can thiệp y học? Bài viết dưới đây sẽ giúp bạn có câu trả lời cụ thể và giải pháp giúp tăng khả năng thụ thai.',
11, '2025-07-24', N'Sức khỏe', 1),

(N'Thai 17 tuần là mấy tháng? Kích thước phát triển và những điều cần lưu ý',
N'Mang thai là một hành trình kỳ diệu và mỗi tuần trôi qua đều đánh dấu những cột mốc phát triển quan trọng của thai nhi và những thay đổi đáng kể trên cơ thể người mẹ. Tuần thai thứ 17 là một giai đoạn đặc biệt, khi thai nhi bắt đầu phát triển mạnh mẽ hơn và mẹ bầu cảm nhận rõ rệt những biến đổi trong cơ thể. Vậy thai 17 tuần là mấy tháng? Thai nhi phát triển như thế nào và mẹ bầu cần lưu ý những gì? Bài viết này sẽ cung cấp thông tin để giúp bạn hiểu rõ hơn về giai đoạn này nhé!

Mang thai 17 tuần là mấy tháng?
Thông thường, việc tính tuổi thai thường dựa trên số tuần. Ở giai đoạn thai 17 tuần tuổi, mẹ bầu đang ở tháng thứ 5 của thai kỳ và cụ thể là 4 tháng 1 tuần.

Cách tính này dựa trên quy ước rằng một tháng thai kỳ trung bình kéo dài khoảng 4 tuần. Tuy nhiên, do mỗi tháng có số ngày khác nhau nên việc xác định chính xác "mấy tháng" thường có tỷ lệ chênh lệch. Đây là thời điểm thai nhi đang phát triển nhanh chóng cả về kích thước lẫn chức năng cơ thể.',
N'Mang thai 17 tuần là mấy tháng? Thai nhi phát triển ra sao và mẹ bầu cần lưu ý những gì? Để giúp mẹ hiểu rõ hơn về những thay đổi trong giai đoạn này, mời bạn đọc cùng tham khảo chi tiết trên bài viết dưới đây nhé!',
11, '2025-07-24', N'Sức khỏe', 1);



 --Blogimage-=====================================================================================================================================================
INSERT INTO dbo.BlogImage (BlogID, ImagePath, ImageCaption, UploadDate, OrderIndex )
VALUES
(1, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951433/ivgihugmou0zjp1emclv.jpg', N'Minh họa chu kỳ kinh nguyệt', '2025-07-08 05:11:20.150', 1),
(2, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951443/dyggaxusc4fme4oet3tev.jpg', N'Thông tin về các bệnh STIs', '2025-07-08 05:09:01.747', 1),
(3, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951112/b3g6xkwcbvrlw4kicotw.jpg', N'Thuốc tránh thai hằng ngày', '2025-07-08 05:08:34.373', 1),
(4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951325/bmjfiuhejrhcj5j5quq.jpg', N'Tư thế lấy mẫu xét nghiệm STIs', '2025-07-08 05:07:42.563', 1),
(5, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951126/imf8crhktlis12j03o8g.jpg', N'Tư vấn giới tính trực tuyến', '2025-07-08 05:03:45.803', 1),
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
INSERT INTO Feedback (AppointmentID, [RecordID], Rating, Comment, FeedbackDate)
VALUES
(NULL, 1, 5, N'Feedback dịch vụ rất tốt', GETDATE()),
(NULL, 9, 5, N'Feedback dịch vụ rất tốt', GETDATE()),
(1, NULL, 5, N'Feedback dịch vụ rất tốt', GETDATE());


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
(NULL, 1, 1050000.00, 'PayPal', '9B766355RJ45471925', '2025-07-14 10:01:36.937', 1, 0.05, 'VND', NULL),
(NULL, 3, 1050000.00, 'PayPal', '6IW823322B527477M', '2025-07-14 13:34:59.577', 1, 0.05, 'VND', '2025-07-14 13:34:59.577'),
(NULL, 6, 1050000.00, 'PayPal', '1BD76296U803490K', '2025-07-16 16:42:49.443', 1, 0.05, 'VND', '2025-07-16 16:42:49.443'),
(NULL, 7, 1050000.00, 'PayPal', '8YX5658U74173812T', '2025-07-19 15:56:32.380', 1, 0.05, 'VND', '2025-07-19 15:56:32.380'),
(NULL, 8, 1050000.00, 'PayPal', '3VB8217R1S160237B', '2025-07-22 16:40:07.407', 1, 0.05, 'VND', '2025-07-22 16:40:07.407'),
(NULL, 9, 1050000.00, 'PayPal', '6F077593P0139692R', '2025-07-22 17:02:30.653', 1, 0.05, 'VND', '2025-07-22 17:02:30.653'),
(NULL, 10, 1050000.00, 'PayPal', '31627614SJ2608229', '2025-07-24 02:14:26.793', 1, 0.05, 'VND', '2025-07-24 02:14:26.793');



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
(8, NULL, 157500.00, 'PayPal', '2KL67890TU432109T', '2025-07-24 13:05:01.000', 1, 0.05, 'VND', '2025-07-24 13:05:01.000'),
(9, NULL, 157500.00, 'PayPal', '3MN78901VW321098V', '2025-07-24 13:06:01.000', 1, 0.05, 'VND', '2025-07-24 13:06:01.000');
--WeeklySchedule--=====================================================================================================================================================
-- Staff (UserID = 3, 6) works morning shift from Mon to Fri
INSERT INTO [WeeklySchedules] (UserId, DayOfWeek, StartTime, EndTime, ShiftType, Note)
VALUES
(3, 1, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 2, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 3, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
(3, 4, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
( 3, 5, '08:00:00.0000000', '12:00:00.0000000', 1, NULL),
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
(4, 4, '08:00:00.0000000', '12:00:00.0000000', 1, NULL);



--WeeklyOverrideSchedule--=====================================================================================================================================================
INSERT INTO dbo.WeeklyOverrideSchedules (UserId, Date, OverrideType, Reason, ShiftType, Status)
VALUES
(3, '2025-06-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(5, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(6, '2025-07-01 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(6, '2025-06-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(6, '2025-07-27 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(5, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(10, '2025-07-04 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(3, '2025-07-05 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã xác nhận'),
(5, '2025-07-08 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(3, '2025-07-16 00:00:00.0000000', N'Làm thêm', N'', 2, N'Đang chờ duyệt'),
(10, '2025-07-17 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt');
