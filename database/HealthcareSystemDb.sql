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
('Local', NULL, N'Phạm Nguyễn Đăng Hải', '$2b$12$hjtLyni3G0HRc2ZW80Pqy.iehAis/gEXgwFM90QxoZ5.SeXFQlAPy', 'pndhai@gmail.com', '0900000001', '1990-01-01', 'MALE', N'Quận 3, TP.HCM', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Văn Hiếu', '$2b$12$c/AAkCxOXWR3NV9eoTuYZux5omogNoyNn/kwIfw8cCJzm51F.08Km', 'hieubmk2210@gmail.com', '0900000001', '1990-01-01', 'MALE', N'Quận 5, TP.HCM', GETDATE(), NULL, 'MB', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Trọng Tốt', '$2b$12$S3vJka0JR7z/6nQzCWggZ.xepI5V35EwsA9qhKpM5lRRxINuD8KMe', 'totn786@gmail.com', '0900000001', '1990-01-01', 'MALE', N'Quận 7, TP.HCM', GETDATE(), NULL, 'CS', NULL, NULL, 1),

('Local', NULL, N'Phạm Văn A', '$2b$12$3cp8.Ow3.K9IcQ755h/AQemjyo3HvJihF1t1DnkE/SrkvvgXJ98V6', 'st1@gmail.com', '0900000001', '1990-01-01', 'MALE', N'Ba Đình, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Nguyễn Thị B', '$2b$12$Z3t4PM.cwdj15n7WE4iukOKCpX64O2xiJrYw/yNnZwPtu/id7Ulqy', 'st2@gmail.com', '0900000002', '1990-01-01', 'FEMALE', N'Cầu Giấy, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Lê Văn C', '$2b$12$89QkxPonD5JMDU.1huUGGu1BozLmOwUNKmoAJPJF1llv7hInR5CO2', 'st3@gmail.com', '0900000003', '1990-01-01', 'MALE', N'Đống Đa, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Trần Thị D', '$2b$12$mYXj/4b3m0aO1UrTcU16DudS/NlzY2HKnnlzcj3JBq5k6eTgSMw4.', 'st4@gmail.com', '0900000004', '1990-01-01', 'FEMALE', N'Tây Hồ, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),
('Local', NULL, N'Đỗ Văn E', '$2b$12$HMoag.2c2xwHEvF/mHNRl.gMTILC0UiTXg9ktP2Zr7w9argdcVAVa', 'st5@gmail.com', '0900000005', '1990-01-01', 'MALE', N'Thanh Xuân, Hà Nội', GETDATE(), NULL, 'ST', NULL, NULL, 1),

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


INSERT INTO Appointment (MemberID, MeetLink, ServiceID, ConsultantID, StartTime, EndTime, Status)
VALUES
(16, 'https://meet.link/1', 1, 5, '2025-07-15 08:00:00', '2025-07-15 08:30:00', N'Đã đặt'),
(17, 'https://meet.link/2', 2, 11, '2025-07-15 08:45:00', '2025-07-15 09:15:00', N'Đã đặt'),
(18, 'https://meet.link/3', 1, 12, '2025-07-16 10:15:00', '2025-07-16 10:45:00', N'Đã đặt'),
(19, 'https://meet.link/4', 2, 13, '2025-07-16 14:30:00', '2025-07-16 15:00:00', N'Đã đặt'),
(20, 'https://meet.link/5', 1, 14, '2025-07-17 15:15:00', '2025-07-17 15:45:00', N'Đã đặt');
  



--TestServiceRecord --=====================================================================================================================================================
INSERT INTO dbo.TestServiceRecord (
    ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember, MemberID, Result,
    StaffID, RecordDate, TestDate, TimeSlot, Notes, Status
)
VALUES
(1, '1990-01-01', 'MALE', '0900000021', N'Phạm Văn L', 16, NULL, 3, '2025-06-27 13:18:16.997', '2025-06-30', '08:00 - 09:00', NULL, N'Đã đánh giá'),
(1, '1990-01-01', 'FEMALE', '0900000022', N'Nguyễn Thị M', 17, NULL, 6, '2025-06-27 13:19:03.783', '2025-06-30', '08:00 - 09:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'MALE', '0900000023', N'Trần Văn N', 18, NULL, 7, '2025-06-27 13:19:32.320', '2025-06-30', '08:00 - 09:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'FEMALE', '0900000024', N'Lê Thị O', 19, NULL, 8, '2025-06-30 22:51:34.037', '2025-07-05', '08:00 - 09:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'MALE', '0900000025', N'Đỗ Văn P', 20, NULL, 9, '2025-06-30 23:31:39.420', '2025-07-05', '08:00 - 09:00', NULL, N'Đang chờ khám'),

(1, '1990-01-01', 'MALE', '0900000021', N'Phạm Văn L', 16, NULL, 3, '2025-07-03 13:49:14.260', '2025-07-06', '08:00 - 09:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'FEMALE', '0900000022', N'Nguyễn Thị M', 17, NULL, 6, '2025-07-03 13:50:32.387', '2025-07-06', '08:00 - 09:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'MALE', '0900000023', N'Trần Văn N', 18, NULL, 7, '2025-07-03 13:51:36.653', '2025-07-06', '13:00 - 14:00', NULL, N'Đang chờ khám'),
(1, '1990-01-01', 'FEMALE', '0900000024', N'Lê Thị O', 19, NULL, 8, '2025-07-03 13:52:02.603', '2025-07-06', '13:00 - 14:00', NULL, N'Đang thực hiện'),

(1, '1990-01-01', 'MALE', '0900000025', N'Đỗ Văn P', 20, NULL, NULL, '2025-07-03 16:23:11.957', '2025-07-03', '08:00 - 09:00', NULL, N'Đã hủy'),
(1, '1990-01-01', 'MALE', '0900000021', N'Phạm Văn L', 16, NULL, NULL, '2025-07-03 16:23:58.023', '2025-07-03', '08:00 - 09:00', NULL, N'Đang thanh toán'),

(1, '1990-01-01', 'MALE', '0900000023', N'Trần Văn N', 18, NULL, 9, '2025-07-04 22:21:53.317', '2025-07-16', '08:00 - 09:00', NULL, N'Đang chờ khám');


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
 NULL, '2025-07-05 08:00:00', 9, N'Bị từ chối', 35, N'Nữ', 18, 4);

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
 NULL, 1);


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
 13, '2025-05-10', N'Tâm lý', 1);



 --Blogimage-=====================================================================================================================================================
INSERT INTO dbo.BlogImage (BlogID, ImagePath, ImageCaption, UploadDate, OrderIndex )
VALUES
(1, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951433/ivgihugmou0zjp1emclv.jpg', N'Minh họa chu kỳ kinh nguyệt', '2025-07-08 05:11:20.150', 1),
(2, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951443/dyggaxusc4fme4oet3tev.jpg', N'Thông tin về các bệnh STIs', '2025-07-08 05:09:01.747', 1),
(3, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951112/b3g6xkwcbvrlw4kicotw.jpg', N'Thuốc tránh thai hằng ngày', '2025-07-08 05:08:34.373', 1),
(4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951325/bmjfiuhejrhcj5j5quq.jpg', N'Tư thế lấy mẫu xét nghiệm STIs', '2025-07-08 05:07:42.563', 1),
(5, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951126/imf8crhktlis12j03o8g.jpg', N'Tư vấn giới tính trực tuyến', '2025-07-08 05:03:45.803', 1);

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
-- Feedback cho TestServiceRecord
(NULL, 1, 5, N'Dịch vụ xét nghiệm nhanh chóng và nhân viên rất thân thiện.', '2025-07-01 10:00:00'),
(NULL, 2, 4, N'Kết quả được giải thích rõ ràng, nhưng đợi hơi lâu.', '2025-07-01 11:00:00'),
(NULL, 3, 5, N'Bác sĩ tư vấn kỹ lưỡng, tạo cảm giác an tâm.', '2025-07-02 09:30:00'),
(NULL, 4, 5, N'Nhân viên nhẹ nhàng, quy trình lấy mẫu nhanh gọn.', '2025-07-02 15:00:00'),
(NULL, 5, 4, N'Xét nghiệm ok, nhưng phòng chờ hơi chật.', '2025-07-03 08:30:00'),
(NULL, 6, 5, N'Tư vấn về STIs rõ ràng và chi tiết.', '2025-07-04 09:00:00'),
(NULL, 7, 5, N'Địa chỉ phòng khám dễ tìm, nhân viên nhiệt tình.', '2025-07-04 14:00:00'),

-- Feedback cho Appointment
(1, NULL, 5, N'Tư vấn qua video call rất tiện lợi, cảm ơn bác sĩ.', '2025-07-15 09:00:00'),
(2, NULL, 4, N'Dịch vụ ổn, nhưng đôi khi kết nối video hơi lag.', '2025-07-15 09:30:00'),
(3, NULL, 5, N'Tôi cảm thấy được lắng nghe và thấu hiểu.', '2025-07-16 11:00:00'),
(4, NULL, 5, N'Tư vấn tâm lý nhẹ nhàng, giúp tôi giải tỏa căng thẳng.', '2025-07-16 15:10:00'),
(5, NULL, 5, N'Lịch hẹn đúng giờ, trao đổi dễ hiểu.', '2025-07-17 16:00:00');


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
    AppointmentID, TestServiceRecordID, TotalAmount, PaymentMethod, TransactionId, CreatedAt, Status, TaxRate, UnitPrice, PaidAt
)
VALUES
-- Invoice cho các Appointment
(1, NULL, 150000, N'PayPal', 'PAYPAL_APPT_0001', '2025-07-15 08:35:00', 1, 0.1, 150000, '2025-07-15 08:35:00'),
(2, NULL, 150000, N'PayPal', 'PAYPAL_APPT_0002', '2025-07-15 09:20:00', 1, 0.1, 150000, '2025-07-15 09:20:00'),
(3, NULL, 150000, N'PayPal', 'PAYPAL_APPT_0003', '2025-07-16 10:50:00', 1, 0.1, 150000, '2025-07-16 10:50:00'),
(4, NULL, 150000, N'PayPal', 'PAYPAL_APPT_0004', '2025-07-16 15:05:00', 1, 0.1, 150000, '2025-07-16 15:05:00'),
(5, NULL, 150000, N'PayPal', 'PAYPAL_APPT_0005', '2025-07-17 15:50:00', 1, 0.1, 150000, '2025-07-17 15:50:00'),

-- Invoice cho các TestServiceRecord
(NULL, 1, 1000000, N'PayPal', 'PAYPAL_TEST_0001', '2025-06-27 13:20:00', 1, 0.1, 1000000, '2025-06-27 13:20:00'),
(NULL, 2, 1000000, N'PayPal', 'PAYPAL_TEST_0002', '2025-06-27 13:25:00', 1, 0.1, 1000000, '2025-06-27 13:25:00'),
(NULL, 3, 1000000, N'PayPal', 'PAYPAL_TEST_0003', '2025-06-27 13:30:00', 1, 0.1, 1000000, '2025-06-27 13:30:00'),
(NULL, 4, 1000000, N'PayPal', 'PAYPAL_TEST_0004', '2025-06-30 22:55:00', 1, 0.1, 1000000, '2025-06-30 22:55:00'),
(NULL, 5, 1000000, N'PayPal', 'PAYPAL_TEST_0005', '2025-07-01 09:00:00', 1, 0.1, 1000000, '2025-07-01 09:00:00'),

(NULL, 6, 1000000, N'PayPal', 'PAYPAL_TEST_0006', '2025-07-03 14:00:00', 1, 0.1, 1000000, '2025-07-03 14:00:00'),
(NULL, 7, 1000000, N'PayPal', 'PAYPAL_TEST_0007', '2025-07-03 14:10:00', 1, 0.1, 1000000, '2025-07-03 14:10:00'),
(NULL, 8, 1000000, N'PayPal', 'PAYPAL_TEST_0008', '2025-07-03 14:20:00', 1, 0.1, 1000000, '2025-07-03 14:20:00'),
(NULL, 9, 1000000, N'PayPal', 'PAYPAL_TEST_0009', '2025-07-03 14:30:00', 1, 0.1, 1000000, '2025-07-03 14:30:00'),

-- Một invoice chưa thanh toán
(NULL, 12, 1000000, N'PayPal', 'PAYPAL_TEST_0012', '2025-07-04 22:25:00', 0, 0.1, 1000000, NULL);



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
(5, '2025-07-08 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt');
