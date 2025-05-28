	 
--Đổi datatype fullname 
--	  ALTER TABLE [dbo].[User]
--ALTER COLUMN [FullName] NVARCHAR(50);

--Đổi datatype [Address] 
--	  ALTER TABLE [dbo].[User]
--ALTER COLUMN [Address] NVARCHAR(100);


--1. Ràng buộc Gender chỉ cho phép 3 giá trị: 'Male', 'Female', 'Other'
--ALTER TABLE [User]
--ADD CONSTRAINT CHK_User_Gender
--CHECK (Gender IN ('Male', 'Female', 'Other'));

INSERT INTO [User] (UserID, FullName,[Password] , Email, PhoneNumber, BirthdayDate, Gender, Address, CreateDate, Avatar)
VALUES
(1,N'Nguyễn Hữu Mỹ', 'pass123@My', 'mexnguyen894@gmail.com', '0987654321', '2004-08-08', 'Male', N'123 Lê Lợi, Quận 1, TP.HCM', GETDATE(), NULL),
(2,N'Tống Anh Tài', 'tai321@Pass', 'taitongngocanh@gmail.com', '0912345678', '2004-05-10', 'Male', N'45 Nguyễn Huệ, TP Biên Hòa, Đồng Nai', GETDATE(), NULL),
(3,N'Phạm Nguyễn Đăng Hải', 'hai456@Acc', 'danghai@gmail.com', '0938123456', '2004-01-01', 'Male', N'78 Trần Phú, TP Huế, Thừa Thiên Huế', GETDATE(), NULL),
(4,N'Nguyễn Văn Hiếu', 'hieu789@Pw', 'hieubmk2210@gmail.com', '0966778899', '2003-01-18', 'Male', N'56 Hai Bà Trưng, TP Nam Định, Nam Định', GETDATE(), NULL),
(5,N'Nguyễn Trọng Tốt', 'tot999@Key', 'totn786@gmail.com', '0977665544', '2004-11-05', 'Male', N'90 Lý Thường Kiệt, TP Vinh, Nghệ An', GETDATE(), NULL);
