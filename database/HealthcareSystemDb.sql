use [HealthcareSystemDb]

--Role --=====================================================================================================================================================
INSERT INTO [Role] ([RoleID], [RoleName], [RoleDescription]) VALUES
('AD', 'Admin', N'Quản trị viên toàn hệ thống'),
('MG', 'Manager', N'Quản lý người dùng và dịch vụ'),
('ST', 'Staff', N'Bác sĩ/tư vấn viên thực hiện chẩn đoán'),
('CS', 'Consultant', N'Nhân viên tư vấn'),  --
('MB', 'Member', N'Thành viên/khách hàng sử dụng dịch vụ');

--User
INSERT INTO dbo.[User] (UserID, Provider, GoogleId, FullName, PasswordHash, Email, PhoneNumber, DoB, Gender, Address, CreateDate, Avatar, RoleID, RefreshToken, RefreshTokenExpiryTime, IsAvailable)
VALUES
(10, 'Local', NULL, N'Nguyen Trong Tot', '$2a$11$M4ziiPKXhbxo4aUTwlsQguAFYJ7LfWJcINbNKWuOwb9WxgQg8gBRK', 'a@gmail.com', '0123456789', NULL, 'MALE', N'District 9 Ho Chi Minh city', '2025-06-30', 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751642677/lucbnpwpd1up1m3n7buy.jpg', 'MB', 'angKA0NKv5D22E+gLNxTA5TeSX0chNxaJgkxL391NH4ztCAcoxf7P0Ru698zmYcPPcLFTW0o2aoehf0DBepAEg==', '2025-07-15 23:30:56.5746982', 1),
(11, 'Local', NULL, N'Trần Nguyễn Đăng Khoa', '$2a$11$6gX3fjk5oyyHWrPlZmz2NumNXSnGOeU4BZMSBjLA50ThCownOXgXW', 'admin@gmail.com', '0334455668', '1999-02-10', 'MALE', N'District 9 Ho Chi Minh city', '2025-07-08', NULL, 'AD', 'jA6enLjqdRkSOoPi+Z/t92RhDf+Z5s84RrOxm5Acbkrk/oeNGczHbbyfVRpwlD6J2pD7OETX1JuzM/BcU4JoPg==', '2025-07-23 10:38:42.7933303',1),
(12, 'Local', NULL, N'Nguyễn Nhật Nam', '$2a$11$cgVuNYBpbjDj2eK0CYDd.uscR5e9LDIRBXRBDDjkf/PDya.bbccI6', 'manager@gmail.com', '0975662443', '1993-07-08', 'MALE', N'123 Lê Lợi, Quận 1, TP.HCM', '2025-07-08', NULL, 'MG', '6ebcpBY43MPz7k4cOcTGRcw/jZVSX2fo67hlmHiMLohcg3Nte0GgG+vLCMYL5FFDz6IDsKXZQtUi9vXXpnxmtg==', '2025-07-23 10:42:15.7446083', 1),
(13, 'Local', NULL, N'Trần Ngọc Tâm', '$2a$11$ZsbFmeJlhFX7lpMuPN.zhOnispEUsGpebKqP34KUIIfsNGWETsB3S', 'consultant1@gmail.com', '0376378351', '1998-04-08', 'FEMALE', N'45 Nguyễn Huệ, TP Biên Hòa, Đồng Nai', '2025-07-08', NULL, 'CS', 'rkZbOmlbrEyUOwdb/X32WmHElHdOdd4HF8MgNLyhmPk13dyGNTF3peT0lFFaYOJxTQ4k9CK9ARR0ytZvbExcJw==', '2025-07-23 10:45:50.4379076', 1),
(14, 'Local', NULL, N'Võ Hạ Trâm', '$2a$11$lVWamY6dIvlNRlJnUGSnROxoKFqtQQlgarnoCJFt15Ek5e2L6Ov0a', 'consultant2@gmail.com', '0975672444', '2000-04-20', 'FEMALE', N'90 Lý Thường Kiệt, TP Vinh, Nghệ An', '2025-07-08', NULL, 'CS', 'CH1Y2ZCzQhvrZKgpbgXrV4Rq0YtRjihd86F/LwM6CaprB5oCg85qUXYbF4YfPIYquddxDaiTGT3+29oXC5+nZQ==', '2025-07-23 10:47:15.3388636', 1),
(15, 'Local', NULL, N'Trần Minh Hiếu', '$2a$11$ukIZLq0FgkBFrr/tbLOHiuBrSTHhRBuJSyh5/20CoroG1Sf/JDEmu', 'consultant3@gmail.com', '0129875672', '1997-04-21', 'MALE', N'56 Hai Bà Trưng, TP Nam Định, Nam Định', '2025-07-08', NULL, 'CS', 'BkSOjH3/sYZqcwLMCtYyac3C8YX1YoHnL+iWlLjuBIBQTG/47r2t83spSok5xfk2qVdqaL53ixTC4MHFNkQQ2g==', '2025-07-23 10:49:03.5121659', 1),
(16, 'Local', NULL, N'Nguyễn Ngọc Thanh Tâm', '$2a$11$85C1ZHEMSg2CXrXn1p/.YO40twDS8CzFzF/Pp/l4D6rk8CsJjqcNe', 'consultant4@gmail.com', '0337658971', '1999-08-25', 'FEMALE', N'90 Lý Thường Kiệt, TP Vinh, Nghệ An', '2025-07-08', NULL, 'CS', 'xNeQQMBztTGAI1ad670WR37IJ8nW46hE+tlD3huIt2SGZVzmN7Ay4KZlBOUTzmVJXlTAiWUPrLNlG9TGAM3sIA==', '2025-07-23 10:50:26.7591554', 1),
(17, 'Local', NULL, N'Nguyễn Ngọc Lan', '$2a$11$XgC8VblbPtjjNpntJdliIe9lPugRDGaLsXdPAUcyfsCevswfZW.RW', 'consultant5@gmail.com', '0975662442', NULL, 'FEMALE', N'District 9 Ho Chi Minh city', '2025-07-08', NULL, 'CS', 'exLqo96dfEPTfZdh30oK3KqTSUNHp68eBWSfkaqX58/2kbDdphF89CZx4OIn8Zc1z20bSKkmbrdPwjAwhoWfHA==', '2025-07-23 10:51:45.0368707', 1),
(18, 'Local', NULL, N'Phạm Nguyễn Đăng Hải', '$2a$11$srzRZGAZoygUNNRR001zq.2fxT7IHceHxncyWHWdYKXIODeO1Ko3G', 'staff1@gmail.com', '0338123456', NULL, 'MALE', N'78 Trần Phú, TP Huế', '2025-07-08', NULL, 'ST', 'XJKtNW4BNS9GekHWnUF2nVklOzINob3IWX1HZnLYGzbcf+be5+UdkdhhAtkBGBZ/yQwLA6zwOxi/6j+owAszyA==', '2025-07-23 10:56:00.4994595',1),
(19, 'Local', NULL, N'Nguyễn Văn Hiếu', '$2a$11$kx5Ys/YC/94FHoR9BRzO3uYQ44Jp36MzLZ5gV5wTvuWVj1GMRHOh.', 'staff2@gmail.com', '0976782443', '1977-05-16', 'MALE', N'56 Hai Bà Trưng, TP Nam Định, Nam Định', '2025-07-08', NULL, 'ST', '0CgzYn+Bf0PN48JZWKuDRoQClm/IhksCgdPl18vG4XKP9zay6Xaj6SXieOqislmLI1OJjwAs45jt6XLci/o95A==', '2025-07-23 10:57:36.8174730',1),
(20, 'Local', NULL, N'Tống Ngọc Anh Tài', '$2a$11$NOrZtGHa9G1sVR6ouIVi/O2aC48iODisgYASkQrpTQ6xFEAoypWKW', 'staff3@gmail.com', '0235662443', '1993-05-10', 'MALE', N'45 Nguyễn Huệ, TP Biên Hòa, Đồng Nai', '2025-07-08', NULL, 'ST', 'qeX4nrBu+Gme2kcK5imd4bBPLPtjJivAEXwqNTnDENoLpRQMjD7MBWooXn4F92FFXFKSOpY+h3LFpk5Dum3h/w==', '2025-07-23 10:58:42.1500555', 1),
(21, 'Local', NULL, N'Nguyễn Hữu Hải', '$2a$11$ILCIiawAjI17SHBVH.V3D.1JAxIwCR2.sehkJw1be1qDyZFRSfHoK', 'staff4@gmail.com', '0975672451', '1993-08-06', 'MALE', N'District 3 Ho Chi Minh city', '2025-07-08', NULL, 'ST', '4ps012o9NDI+8tVGLUDyLCMbxhqDrQ/DNer2KMRDk50A7PmPSOB3W8/VwKFfIRAOn7G+JsTk9l12VBxI+e4t4w==', '2025-07-23 10:59:49.7568591', 1),
(22, 'Local', NULL, N'Nguyen Trong Tot', '$2a$11$298qV21Gq0BG46IR8Pkn7Od1V07wboVZGkr/Ocrfo1M.5lsmJ9AIa', 'staff5@gmail.com', '0897652344', '1989-05-11', 'MALE', N'District 6 Ho Chi Minh city', '2025-07-08', NULL, 'ST', '98rBcVAbEflCUOl/7bQPPvC+xKn1dl3+fBZx7TzGn3o0zcgdGKodn/iL7ZegJWMzoK3LODvjqo+5cPo2oqbGlw==', '2025-07-23 11:01:16.2013933', 1),
(23, 'Local', NULL, N'Hoàng Khánh Huyền', '$2a$11$oLE4QP9epj4jo8kzYEuxrudlH1KpUTITOX6tuLnhddg5hSl8UgQnC', 'ct81@gmail.com', '0789654123', '2002-11-05', 'FEMALE', N'District 1 Ho Chi Minh city', '2025-07-08', NULL, 'MB', 'FZilWK9M9ujykMZxixZm3k+CrdnqzE0L+YFqa4DEe/XubULYoV7odQVoL9xXtKV0Q4ANFhV6k2IbeA4SgmrUfQ==', '2025-07-23 11:48:13.5237925', 1),
(24, 'Local', NULL, N'Hoàng Hữu Ân', '$2a$11$zCBIaYuLnlhvJFCvyqDVUebp.Ag6aQMlZLdW5Be8yVhe7luIy5kMG', 'ct82@gmail.com', '0965672345', '2002-08-13', 'MALE', N'District 3 Ho Chi Minh city', '2025-07-08', NULL, 'MB', '1cvZ0TFGpYjJp8ZVKFSPHMBMTGncu95QXlI9v7rz9NDVki68DOt3G+tLDR+NIfy9H7Qco+YecUKQJxRFKcqrGQ==', '2025-07-23 11:49:56.4440669', 1),
(25, 'Local', NULL, N'Võ Hữu Ninh', '$2a$11$y72Iy0x39mZ9YCTa8ft0wOEnCenYIy1KzLFpmA/3wm/Q8MP2zM61K', 'ha7113@gmail.com', '0765234723', '1995-08-14', 'MALE', N'District 9 Thu Duc city', '2025-07-08', NULL, 'MB', 'Nrg10mtNkSjPIm8cC8FuOXZvtaNuTgACXGwBwc3I8mW6g3xIb7n84YXbnOWX3CkQN3PqPpwx9y91YquRB/XcGg==', '2025-07-23 11:50:45.1988466', 1),
(26, 'Local', NULL, N'Hoàng Thủy Tiên', '$2a$11$GTHAiVZAx9FhQ.Seg1SsFuH5biWE0ZFKGu7enN0tMXwel.5qZz//K', 'tt1331@gmail.com', '0985672312', '2003-05-12', 'FEMALE', N'District 7 Ho Chi Minh city', '2025-07-08', NULL, 'MB', 'MP+3yWfKnmo18u7YtG6B3eXhz6a87sxAXKxVix3O2d/Wsj1La6Wzwfktp7+LxzTL6b2xuycqN8ffYi4DtUuFhQ==', '2025-07-23 11:51:36.6939967', 1);



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
(18, 1),
(19, 2),
(18, 3),
(19, 4),
(20, 5),
(20, 8),
(21, 8),
(22, 8);

--Appointment--=====================================================================================================================================================
--chưa hoàn thiện
--UserID 5 là Member (người đặt lịch) và UserID 4 là Consultant
--INSERT INTO Appointment (MemberID, MeetLink, ServiceID, ConsultantID, StartTime, EndTime, Status)
--VALUES
--(5, 'https://meet.link/1', 2, 4, '2025-06-03 08:00:00', '2025-06-03 08:30:00', N'Đã đặt'),
--(5, 'https://meet.link/2', 1, 4, '2025-06-03 14:00:00', '2025-06-03 14:45:00', N'Đã đặt');   



--TestServiceRecord --=====================================================================================================================================================
INSERT INTO dbo.TestServiceRecord (
    TestServiceRecordID, ServiceID, Dob, Gender, PhoneNumber, FullNameOfMember, MemberID, Result,
    StaffID, RecordDate, TestDate, TimeSlot, Notes, Status
)
VALUES
(1, 1, '2025-06-27', 'Male', '0123456789', N'Tốt', 11, NULL, 18, '2025-06-27 13:18:16.997', '2025-06-30', '08:00:00', NULL, N'Da danh gia'),
(2, 1, '2025-06-27', 'Male', '0123456789', N'Tốt', 12, NULL, 19, '2025-06-27 13:19:03.783', '2025-06-30', '08:00:00', NULL, N'Dang cho kham'),
(3, 1, '2025-06-27', 'Male', '0123456789', N'Tốt', 18, NULL, 18, '2025-06-27 13:19:32.320', '2025-06-30', '08:00:00', NULL, N'Dang cho kham'),
(4, 1, '2004-06-30', 'Male', '0123456789', N'string', 11, NULL, 18, '2025-06-30 22:51:34.037', '2025-07-30', '08:00:00', NULL, N'Dang cho kham'),
(5, 1, '2000-09-28', 'Nam', '0975672459', N'Tót', 10, NULL, 18, '2025-06-30 23:31:39.420', '2025-07-02', '08:00:00', NULL, N'Dang cho kham'),
(6, 1, '2025-07-03', 'Male', '0123456789', N'string', 11, NULL, 18, '2025-07-03 13:49:14.260', '2025-07-04', '08:00:00', NULL, N'Dang cho kham'),
(7, 1, '2025-07-03', 'Male', '0123456789', N'string', 12, NULL, 18, '2025-07-03 13:50:32.387', '2025-07-04', '08:00:00', NULL, N'Dang cho kham'),
(8, 1, '2025-07-03', 'Male', '0123456789', N'string', 11, NULL, 20, '2025-07-03 13:51:36.653', '2025-07-04', '13:00:00', NULL, NULL),
(9, 1, '2025-07-03', 'Male', '0123456789', N'string', 12, NULL, 21, '2025-07-03 13:52:02.603', '2025-07-04', '13:00:00', NULL, N'Dang thuc hien'),
(10, 1, '2025-07-03', 'Male', '0123456789', N'string', 11, NULL, NULL, '2025-07-03 16:23:11.957', '2025-07-03', '08:00:00', NULL, N'Da huy'),
(11, 1, '2025-07-03', 'Male', '0123456789', N'string', 11, NULL, NULL, '2025-07-03 16:23:58.023', '2025-07-03', '08:00:00', NULL, N'Dang thanh toan'),
(12, 1, '2000-07-02', 'Nam', '0975672459', N'Nguyen Trong Tot', 10, NULL, 18, '2025-07-04 22:21:53.317', '2025-07-16', '08:00:00', NULL, N'Dang cho kham');

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
INSERT INTO dbo.Blog (
    BlogID, Title, Content, Description, ConsultantID, PublishDate, Topic, Status )
VALUES
(1, N'Cách theo dõi chu kỳ kinh nguyệt và nhận biết thời gian rụng trứng',
 N'Nắm rõ chu kỳ kinh nguyệt giúp bạn dự đoán thời gian rụng trứng và khả năng mang thai. Trong bài viết này, chúng tôi hướng dẫn bạn cách theo dõi và sử dụng công cụ tính chu kỳ hiệu quả.',
 N'Hướng dẫn theo dõi chu kỳ kinh nguyệt để nhận biết thời điểm rụng trứng và tránh thai tự nhiên.',
 14, '2025-05-20', N'Sức khỏe', 1),

(2, N'Những điều cần biết về các bệnh lây truyền qua đường tình dục (STIs)',
 N'STIs là các bệnh nguy hiểm có thể ảnh hưởng đến sức khỏe sinh sản và cuộc sống tình dục. Bài viết giúp bạn hiểu rõ về dấu hiệu, cách phòng ngừa và thời điểm cần xét nghiệm.',
 N'Hiểu đúng về STIs – dấu hiệu, cách lây và phòng ngừa hiệu quả.',
 14, '2025-05-18', N'STIs', 1),

(3, N'Thuốc tránh thai: Cách dùng đúng và những lưu ý quan trọng',
 N'Không chỉ uống đúng giờ, người dùng thuốc tránh thai còn cần lưu ý nhiều điều khác để đảm bảo hiệu quả tránh thai. Bài viết giải đáp chi tiết những thắc mắc thường gặp.',
 N'Giải đáp mọi thắc mắc về việc sử dụng thuốc tránh thai an toàn và hiệu quả.',
 13, '2025-05-15', N'Sức khỏe', 1),

(4, N'Lần đầu đi xét nghiệm STIs – Cần chuẩn bị gì?',
 N'Nhiều người lo lắng hoặc ngại ngùng khi đi xét nghiệm STIs. Bài viết chia sẻ quy trình, những điều cần chuẩn bị và cách lấy kết quả an toàn, bảo mật.',
 N'Chuẩn bị tâm lý và hiểu quy trình khi đi xét nghiệm STIs lần đầu.',
 15, '2025-05-12', N'Hướng dẫn', 1),

(5, N'Tư vấn giới tính online – Giải pháp an toàn và tiện lợi cho giới trẻ',
 N'Tư vấn giới tính trực tuyến giúp bạn giải đáp những thắc mắc nhạy cảm một cách kín đáo và nhanh chóng. Hãy tìm hiểu cách đặt lịch và trao đổi hiệu quả với chuyên gia.',
 N'Tìm hiểu cách tư vấn giới tính online và những lợi ích mang lại.',
 13, '2025-05-10', N'Tâm lý', 1);



 --Blogimage-=====================================================================================================================================================
INSERT INTO dbo.BlogImage (
    ImageID, BlogID, ImagePath, ImageCaption, UploadDate, OrderIndex )
VALUES
(1, 1, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951433/ivgihugmou0zjp1emclv.jpg', N'Minh họa chu kỳ kinh nguyệt', '2025-07-08 05:11:20.150', 1),
(2, 2, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951443/dyggaxusc4fme4oet3tev.jpg', N'Thông tin về các bệnh STIs', '2025-07-08 05:09:01.747', 1),
(3, 3, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951112/b3g6xkwcbvrlw4kicotw.jpg', N'Thuốc tránh thai hằng ngày', '2025-07-08 05:08:34.373', 1),
(4, 4, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951325/bmjfiuhejrhcj5j5quq.jpg', N'Tư thế lấy mẫu xét nghiệm STIs', '2025-07-08 05:07:42.563', 1),
(5, 5, 'https://res.cloudinary.com/dktu0nbjx/image/upload/v1751951126/imf8crhktlis12j03o8g.jpg', N'Tư vấn giới tính trực tuyến', '2025-07-08 05:03:45.803', 1);

--Blogview -=====================================================================================================================================================
INSERT INTO dbo.BlogView (BlogViewID, MemberID, BlogID, ViewDate)
VALUES
(1, 10, 1, '2025-06-26 13:21:41.863'),
(2, 10, 2, '2025-06-26 13:21:41.863'),
(3, NULL, 3, '2025-07-01 13:29:37.860'),
(4, NULL, 1, '2025-07-01 13:29:37.967'),
(5, NULL, 2, '2025-07-01 15:03:52.057'),
(6, NULL, 3, '2025-07-01 15:05:08.526'),
(7, NULL, 5, '2025-07-01 15:05:08.563'),
(8, NULL, 1, '2025-07-01 15:05:08.573'),
(9, NULL, 2, '2025-07-01 15:05:08.597'),
(10, NULL, 3, '2025-07-01 15:34:53.640'),
(11, NULL, 5, '2025-07-01 15:34:53.640'),
(12, NULL, 4, '2025-07-01 15:34:53.640'),
(13, NULL, 1, '2025-07-08 12:06:37.037'),
(14, NULL, 1, '2025-07-08 12:07:16.987'),
(15, NULL, 1, '2025-07-08 12:07:38.087'),
(16, NULL, 1, '2025-07-08 12:08:04.087'),
(17, NULL, 1, '2025-07-08 12:08:36.060'),
(18, NULL, 1, '2025-07-08 12:10:43.747'),
(19, NULL, 1, '2025-07-08 12:11:03.747'),
(20, NULL, 1, '2025-07-08 12:11:13.747'),
(21, NULL, 1, '2025-07-08 12:11:23.090');


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
INSERT INTO dbo.Notification (NotificationID, UserID, Title, Content, SendTime, IsRead)
VALUES
(1, 18, N'Thông báo hệ thống', N'Hệ thống sẽ bảo trì lúc 23:00 đêm nay.', '2025-06-26 13:21:41.863', 0),
(2, 18, N'Xác nhận email', N'Vui lòng xác nhận email để tiếp tục sử dụng dịch vụ.', '2025-06-26 13:21:41.863', 0),
(3, 13, N'Cập nhật hồ sơ', N'Hồ sơ của bạn đã được cập nhật thành công.', '2025-06-26 13:21:41.863', 1),
(4, 10, N'Thông báo thanh toán', N'Giao dịch #TX2931 đã được xác nhận.', '2025-06-26 13:21:41.863', 0),
(5, 13, N'Mật khẩu đã thay đổi', N'Bạn vừa thay đổi mật khẩu thành công.', '2025-06-26 13:21:41.863', 1),
(6, 11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:18:42.367', 0),
(7, 12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:19:21.720', 0),
(8, 18, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-27 13:19:50.697', 0),
(9, 11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-30 22:52:07.173', 0),
(10, 10, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-06-30 23:31:56.720', 1),
(11, 10, N'Đặt lịch xét nghiệm thành công', N'Bạn đã đặt lịch xét nghiệm thành công. Mã phiếu: 5', '2025-06-30 16:31:58.967', 1),
(12, 18, NULL, N'Bạn có một câu hỏi mới từ 10', '2025-07-01 08:06:46.830', 0),
(13, 10, NULL, N'Câu hỏi của bạn đã được gửi thành công và sẽ sớm được trả lời.', '2025-07-01 08:06:46.830', 1),
(14, 10, NULL, N'Bạn đã đặt câu hỏi thành công yêu em', '2025-07-01 08:07:16.803', 1),
(15, 18, NULL, N'Bạn có một câu hỏi mới từ yêu em', '2025-07-01 08:07:16.803', 0),
(16, 11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:50:15.200', 0),
(17, 12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:50:53.430', 0),
(18, 11, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:51:57.657', 0),
(19, 12, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-03 13:52:24.243', 0),
(20, 11, N'Hủy xét nghiệm', N'Xét nghiệm của bạn đã được hủy.', '2025-07-03 16:23:55.060', 0),
(21, 12, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:03:50.460', 1),
(22, 11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:04:16.613', 0),
(23, 11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-03 17:04:58.397', 1),
(24, 11, N'Cập nhật thông tin xét nghiệm', N'Bác sĩ đã cập nhật trạng thái cho xét nghiệm của bạn.', '2025-07-04 22:20:48.333', 1),
(25, 10, N'Thanh toán thành công', N'Bạn đã thanh toán thành công đặt lịch xét nghiệm.', '2025-07-04 22:22:06.243', 1),
(26, 10, N'Đặt lịch xét nghiệm thành công', N'Bạn đã đặt lịch xét nghiệm thành công. Mã phiếu: 12', '2025-07-04 15:22:07.140', 0),
(27, 18, N'Lịch làm việc', N'Bạn có lịch làm việc mới ,kiểm tra lịch làm việc ngay nhé', '2025-07-06 01:48:34.343', 0),
(28, 13, N'Cập nhật lịch làm việc', N'Lịch làm việc Thứ 3 ca ca sáng đã được xóa khỏi lịch làm việc thường xuyên của bạn.', '2025-07-06 16:12:36.383', 1),
(29, 18, N'Lịch làm việc mới', N'Bạn đã được thêm vào lịch làm việc thường xuyên: Thứ 7 ca Chiều (13:00 - 17:00). Vui lòng kiểm tra và xác nhận lịch làm việc của bạn.', '2025-07-06 16:13:36.467', 0),
(30, 18, N'Cập nhật lịch làm việc', N'Lịch làm việc của bạn đã được cập nhật: Thứ 7 ca sáng (08:00 - 12:00). Vui lòng kiểm tra ở mục lịch làm việc của bạn.', '2025-07-06 16:48:57.497', 0),
(31, 18, N'Cập nhật lịch làm việc', N'Lịch làm việc của bạn đã được cập nhật: Thứ 7 ca chiều (13:00 - 17:00). Vui lòng kiểm tra ở mục lịch làm việc của bạn.', '2025-07-06 16:49:24.997', 0);




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
INSERT INTO dbo.WeeklyOverrideSchedules
(WeeklyOverrideScheduleId, UserId, Date, OverrideType, Reason, ShiftType, Status)
VALUES
(1, 20, '2025-06-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(2, 21, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(3, 22, '2025-07-01 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(4, 22, '2025-06-29 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(5, 22, '2025-07-27 00:00:00.0000000', N'Làm thêm', N'Lý do cá nhân', 2, N'Đang chờ duyệt'),
(6, 21, '2025-06-30 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã từ chối'),
(7, 19, '2025-07-04 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 3, N'Đã xác nhận'),
(8, 20, '2025-07-05 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đã xác nhận'),
(9, 21, '2025-07-08 00:00:00.0000000', N'Nghỉ', N'Lý do cá nhân', 2, N'Đang chờ duyệt');
