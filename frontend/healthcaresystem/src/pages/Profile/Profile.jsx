import { Card, Descriptions, Avatar, Button, Divider, Spin, Modal, Form, Input, Upload, message, DatePicker, Select, Tag, Typography } from 'antd';
import { 
     UserOutlined, 
     UploadOutlined, 
     LockOutlined, 
     HomeOutlined,
     MailOutlined,
     PhoneOutlined,
     EnvironmentOutlined,
     CalendarOutlined,
     IdcardOutlined,
     SafetyOutlined,
     TeamOutlined,
     CheckCircleOutlined
} from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { authApi, getInfo } from '../../services/api';
import Cookies from 'js-cookie';
import './Profile.css';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContext } from '../../contexts/ToastProvider';
import PasswordInput from '../../components/FormInput/PasswordInput';

function Profile() {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
     const [form] = Form.useForm();
     const [setAvatarFile] = useState(null);
     const [uploading, setUploading] = useState(false);
     const [changingPassword, setChangingPassword] = useState(false);
     const [uploadingAvatar, setUploadingAvatar] = useState(false);
     const { toast } = useContext(ToastContext);

     // New state variables for password change flow
     const [passwordStep, setPasswordStep] = useState(1); // 1: current password, 2: OTP, 3: new password
     const [currentPassword, setCurrentPassword] = useState('');
     const [otp, setOtp] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [confirmNewPassword, setConfirmNewPassword] = useState('');
     const [otpError, setOtpError] = useState('');
     const [isOtpLoading, setIsOtpLoading] = useState(false);
     const [otpCountdown, setOtpCountdown] = useState(180); // 3 minutes
     const otpTimerRef = useRef();

     // Start countdown when OTP step is active
     useEffect(() => {
          if (passwordStep === 2) {
               setOtpCountdown(180);
               if (otpTimerRef.current) clearInterval(otpTimerRef.current);
               otpTimerRef.current = setInterval(() => {
                    setOtpCountdown(prev => {
                         if (prev <= 1) {
                              clearInterval(otpTimerRef.current);
                              return 0;
                         }
                         return prev - 1;
                    });
               }, 1000);
          } else {
               if (otpTimerRef.current) clearInterval(otpTimerRef.current);
          }
          return () => { if (otpTimerRef.current) clearInterval(otpTimerRef.current); };
     }, [passwordStep]);

     useEffect(() => {
          const userId = Cookies.get('userId');

          const fetchUserInfo = async () => {
               try {
                    setLoading(true);
                    
                    const response = await getInfo(userId);
                    
                    const userData = {
                         ...response.data,
                         dateOfBirth: response.data.doB || response.data.DoB,
                         avatar: response.data.avatarPath || response.data.avatar,
                         role: response.data.role,
                         provider: response.data.provider || response.data.Provider
                    };
                    setUser(userData);
                    setError(null);
               } catch (err) {
                    console.error('Error fetching user info:', err);
                    setError('Failed to load user information');
               } finally {
                    setLoading(false);
               }
          }

          if (userId) {
               fetchUserInfo();
          } else {
               setError('User ID not found');
               setLoading(false);
          }
     }, []);

     const showModal = () => {
          form.setFieldsValue({
               name: user?.name,
               fullName: user?.fullName,
               email: user?.email,
               phoneNumber: user?.phoneNumber,
               address: user?.address,
               dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : null,
               gender: user?.gender,
          });
          setIsModalVisible(true);
     };

     const handleCancel = () => {
          setIsModalVisible(false);
          form.resetFields();
          setAvatarFile(null);
     };

     const uploadToCloudinary = async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'healthcare');

          const response = await fetch(
               'https://api.cloudinary.com/v1_1/dktu0nbjx/image/upload',
               {
                    method: 'POST',
                    body: formData,
               }
          );
          const data = await response.json();
          return data.secure_url;
     };

     const handleAvatarChange = async (info) => {
          if (info.file.status === 'removed') {
               form.setFieldValue('avatarPath', '');
               return;
          }
          if (info.file.status !== 'done' && info.file.status !== 'uploading') {
               return;
          }
          const file = info.file.originFileObj;
          if (!file) return;
          setUploadingAvatar(true);
          try {
               const url = await uploadToCloudinary(file);
               form.setFieldValue('avatarPath', url);
               message.success('Tải ảnh lên thành công!');
          } catch {
               message.error('Tải ảnh lên thất bại!');
          } finally {
               setUploadingAvatar(false);
          }
     };

     const handleUpdateProfile = async (values) => {
          try {
               setUploading(true);

               const dataToSend = {
                    ...values,
                    doB: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
                    avatar: values.avatarPath,
               };
               delete dataToSend.dateOfBirth;
               delete dataToSend.avatarPath;

               const filteredData = {};
               Object.keys(dataToSend).forEach(key => {
                    if (dataToSend[key] !== undefined && dataToSend[key] !== null) {
                         filteredData[key] = dataToSend[key];
                    }
               });

               const userId = Cookies.get('userId');
               const response = await authApi.updateUserInfo(userId, filteredData);

               // Cập nhật user state với dữ liệu mới
               const updatedUser = {
                    ...user,
                    ...response.data,
                    dateOfBirth: response.data.doB || response.data.DoB,
                    avatar: response.data.avatarPath || response.data.avatar,
               };
               setUser(updatedUser);
               
               // Cập nhật localStorage với thông tin mới
               const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
               const updatedUserInfo = { ...userInfo, ...response.data };
               localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
               
               toast.success('Cập nhật thông tin thành công!');
               setIsModalVisible(false);
               form.resetFields();
               setTimeout(() => {
                    window.location.reload();
               }, 1000);
          } catch (err) {
               console.error('Error updating profile:', err);
               message.error('Cập nhật thông tin thất bại!');
          } finally {
               setUploading(false);
          }
     };

     const showPasswordModal = () => {
          setPasswordStep(1);
          setCurrentPassword('');
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
          setOtpError('');
          setIsPasswordModalVisible(true);
     };

     const handlePasswordCancel = () => {
          setIsPasswordModalVisible(false);
          setPasswordStep(1);
          setCurrentPassword('');
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
          setOtpError('');
          if (otpTimerRef.current) clearInterval(otpTimerRef.current);
     };

     // Step 1: Verify current password
     const handleVerifyCurrentPassword = async (e) => {
          e.preventDefault();
          if (!currentPassword) {
               message.error('Vui lòng nhập mật khẩu hiện tại!');
               return;
          }

          try {
               setChangingPassword(true);
               const userEmail = Cookies.get('email');
               
               // Verify current password using login API
               await authApi.login({ email: userEmail, password: currentPassword });
               
               // If login successful, send OTP
               const userId = Cookies.get('userId');
               setIsOtpLoading(true);
               await authApi.sendOtpRegisterVerify(userId);
               setIsOtpLoading(false);
               
               // Move to OTP step
               setPasswordStep(2);
               setOtpError('');
          } catch (err) {
               console.error('Error verifying current password:', err);
               message.error('Mật khẩu hiện tại không đúng!');
          } finally {
               setChangingPassword(false);
          }
     };

     // Step 2: Verify OTP
     const handleVerifyOtp = async (e) => {
          e.preventDefault();
          if (!otp) {
               setOtpError('Vui lòng nhập mã OTP!');
               return;
          }

          try {
               setIsOtpLoading(true);
               const userId = Cookies.get('userId');
               const res = await authApi.verifyOtpRegister(userId, otp);
               
               if (res.data.success || res.data === 'OTP xác thực thành công.') {
                    setPasswordStep(3);
                    setOtpError('');
               } else {
                    setOtpError(res.data.message || 'Mã OTP không đúng!');
               }
          } catch (err) {
               setOtpError(err.response?.data?.message || 'Mã OTP không đúng!');
          } finally {
               setIsOtpLoading(false);
          }
     };

     // Step 3: Change password
     const handlePasswordChange = async (e) => {
          e.preventDefault();
          if (!newPassword || !confirmNewPassword) {
               message.error('Vui lòng nhập đầy đủ thông tin!');
               return;
          }

          if (newPassword !== confirmNewPassword) {
               message.error('Mật khẩu xác nhận không khớp!');
               return;
          }

          if (newPassword.length < 6) {
               message.error('Mật khẩu phải có ít nhất 6 ký tự!');
               return;
          }

          try {
               setChangingPassword(true);
               const userId = Cookies.get('userId');
               await authApi.changePassword(userId, currentPassword, newPassword);
               
               toast.success('Đổi mật khẩu thành công!');
               setIsPasswordModalVisible(false);
               setPasswordStep(1);
               setCurrentPassword('');
               setOtp('');
               setNewPassword('');
               setConfirmNewPassword('');
               setOtpError('');
               if (otpTimerRef.current) clearInterval(otpTimerRef.current);
          } catch (err) {
               console.error('Error changing password:', err);
               message.error('Đổi mật khẩu thất bại! Vui lòng thử lại.');
          } finally {
               setChangingPassword(false);
          }
     };

     // Resend OTP
     const handleResendOtp = async () => {
          setOtpError('');
          setIsOtpLoading(true);
          try {
               const userId = Cookies.get('userId');
               await authApi.sendOtpRegisterVerify(userId);
               toast.success('Đã gửi lại OTP đến email của bạn.');
               setOtpCountdown(180);
               if (otpTimerRef.current) clearInterval(otpTimerRef.current);
               otpTimerRef.current = setInterval(() => {
                    setOtpCountdown(prev => {
                         if (prev <= 1) {
                              clearInterval(otpTimerRef.current);
                              return 0;
                         }
                         return prev - 1;
                    });
               }, 1000);
          } catch {
               setOtpError('Gửi lại OTP thất bại.');
          } finally {
               setIsOtpLoading(false);
          }
     };

     if (loading) {
          return (
               <MainLayout>
                    <div className="profile-loading">
                         <Spin size="large" />
                         <div style={{ marginTop: 16, color: 'white', fontSize: 16 }}>Đang tải thông tin...</div>
                    </div>
               </MainLayout>
          );
     }

     if (error) {
          return (
               <MainLayout>
                    <Card className="profile-container">
                         <div className="profile-error">{error}</div>
                    </Card>
               </MainLayout>
          );
     }

     if (!user) {
          return null;
     }

     return (
          <MainLayout>
               <div className="profile-container">
                    {/* Hero Section */}
                    <div className="profile-hero">
                    <div className="profile-header">
                              <div className="profile-avatar-section">
                              <Avatar
                                        size={120}
                                   src={user.avatar}
                                   icon={<UserOutlined />}
                                   className="profile-avatar"
                              />
                         </div>
                              <div className="profile-info-section">
                                   <h1 className="profile-name">{user.fullName || user.name}</h1>
                                   <p className="profile-email">{user.email}</p>
                              <div className="profile-buttons">
                                   <Button type="primary" onClick={showModal} className="profile-edit-button">
                                        Chỉnh sửa hồ sơ
                                   </Button>
                                        {/* Chỉ hiện nút đổi mật khẩu nếu không phải tài khoản Google */}
                                        {user.provider !== 'Google' && (
                                   <Button
                                        type="default"
                                        onClick={showPasswordModal}
                                        className="profile-edit-button"
                                        icon={<LockOutlined />}
                                   >
                                        Đổi mật khẩu
                                   </Button>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Content Section */}
                    <div className="profile-content">
                         {/* Personal Information */}
                         <div className="profile-details-card">
                              <h2 className="profile-details-title">Thông tin cá nhân</h2>
                              <div className="profile-details-list">
                                   <div className="profile-detail-item">
                                        <MailOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Email:</span>
                                        <span className="profile-detail-value">{user.email}</span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <UserOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Họ và tên:</span>
                                        <span className="profile-detail-value">{user.fullName}</span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <PhoneOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Số điện thoại:</span>
                                        <span className="profile-detail-value">{user.phoneNumber || 'Chưa cập nhật'}</span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <EnvironmentOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Địa chỉ:</span>
                                        <span className="profile-detail-value">{user.address || 'Chưa cập nhật'}</span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <CalendarOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Ngày sinh:</span>
                                        <span className="profile-detail-value">
                                             {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                        </span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <UserOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Giới tính:</span>
                                        <span className="profile-detail-value">
                                             {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* Account Information */}
                         <div className="profile-details-card">
                              <h2 className="profile-details-title">Thông tin tài khoản</h2>
                              <div className="profile-details-list">
                                   <div className="profile-detail-item">
                                        <IdcardOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">ID:</span>
                                        <span className="profile-detail-value">{user.userId}</span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <SafetyOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Loại tài khoản:</span>
                                        <span className="profile-detail-value">
                                             {user.provider === 'Google' ? 'Google Account' : 'Local Account'}
                                        </span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <TeamOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Vai trò:</span>
                                        <span className="profile-detail-value">
                                             {user.roleId === 'MB' ? 'Thành viên' : 
                                              user.roleId === 'CS' ? 'Tư vấn viên' :
                                              user.roleId === 'ST' ? 'Nhân viên' :
                                              user.roleId === 'AD' ? 'Quản trị viên' :
                                              user.roleId === 'MG' ? 'Quản lý' : 'Khác'}
                                        </span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <CalendarOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Ngày tạo:</span>
                                        <span className="profile-detail-value">
                                             {user.createDate ? dayjs(user.createDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                        </span>
                                   </div>
                                   <div className="profile-detail-item">
                                        <CheckCircleOutlined className="profile-detail-icon" />
                                        <span className="profile-detail-label">Trạng thái:</span>
                                        <span className="profile-detail-value">
                                             {user.isAvailable ? 'Hoạt động' : 'Tạm khóa'}
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </div>



                    <Modal
                         title={
                              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a' }}>
                                   Chỉnh sửa thông tin
                              </div>
                         }
                         open={isModalVisible}
                         onCancel={handleCancel}
                         footer={null}
                         width={600}
                         style={{ top: 20 }}
                    >
                         <Form
                              form={form}
                              layout="vertical"
                              onFinish={handleUpdateProfile}
                         >
                              <Form.Item
                                   label="Ảnh đại diện"
                                   name="avatarPath"
                              >
                                   <Upload
                                        name="avatar"
                                        listType="picture"
                                        maxCount={1}
                                        onChange={handleAvatarChange}
                                        accept=".jpg,.jpeg,.png"
                                   >
                                        <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                   </Upload>
                              </Form.Item>

                              <Form.Item
                                   label="Họ và tên"
                                   name="fullName"
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item
                                   label="Email"
                                   name="email"
                                   rules={[
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                   ]}
                              >
                                   <Input disabled />
                              </Form.Item>

                              <Form.Item
                                   label="Số điện thoại"
                                   name="phoneNumber"
                                   rules={[{
                                        pattern: /^0\d{9}$/,
                                        message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0!'
                                   }]}
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item
                                   label="Địa chỉ"
                                   name="address"
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item
                                   label="Ngày sinh"
                                   name="dateOfBirth"
                              >
                                   <DatePicker
                                        style={{ width: '100%' }}
                                        disabledDate={current => current && current >= dayjs().endOf('day')}
                                   />
                              </Form.Item>

                              <Form.Item
                                   label="Giới tính"
                                   name="gender"
                              >
                                   <Select>
                                        <Select.Option value="MALE">Nam</Select.Option>
                                        <Select.Option value="FEMALE">Nữ</Select.Option>
                                        <Select.Option value="OTHER">Khác</Select.Option>
                                   </Select>
                              </Form.Item>

                              <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                                   <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={uploading || uploadingAvatar} 
                                        disabled={uploadingAvatar}
                                        size="large"
                                        style={{ 
                                             width: '100%', 
                                             height: '48px',
                                             background: '#54AA7F',
                                             border: 'none',
                                             borderRadius: '8px',
                                             fontSize: '16px',
                                             fontWeight: 600
                                        }}
                                   >
                                        Lưu thay đổi
                                   </Button>
                              </Form.Item>
                         </Form>
                    </Modal>

                    <Modal
                         title={
                              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a' }}>
                                   Đổi mật khẩu
                              </div>
                         }
                         open={isPasswordModalVisible}
                         onCancel={handlePasswordCancel}
                         footer={null}
                         width={500}
                         style={{ top: 20 }}
                    >
                         {/* Step indicator */}
                         <div style={{ marginBottom: 24, textAlign: 'center' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                   <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: passwordStep >= 1 ? '#1890ff' : '#d9d9d9',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                   }}>
                                        1
                                   </div>
                                   <div style={{
                                        width: 40,
                                        height: 2,
                                        backgroundColor: passwordStep >= 2 ? '#1890ff' : '#d9d9d9'
                                   }}></div>
                                   <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: passwordStep >= 2 ? '#1890ff' : '#d9d9d9',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                   }}>
                                        2
                                   </div>
                                   <div style={{
                                        width: 40,
                                        height: 2,
                                        backgroundColor: passwordStep >= 3 ? '#1890ff' : '#d9d9d9'
                                   }}></div>
                                   <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: passwordStep >= 3 ? '#1890ff' : '#d9d9d9',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                   }}>
                                        3
                                   </div>
                              </div>
                              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                   {passwordStep === 1 && 'Nhập mật khẩu hiện tại'}
                                   {passwordStep === 2 && 'Xác thực OTP'}
                                   {passwordStep === 3 && 'Nhập mật khẩu mới'}
                              </div>
                         </div>

                         {/* Step 1: Current Password */}
                         {passwordStep === 1 && (
                              <form onSubmit={handleVerifyCurrentPassword}>
                                   <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                             Mật khẩu hiện tại
                                        </label>
                                        <PasswordInput
                                             label="Nhập mật khẩu hiện tại"
                                             value={currentPassword}
                                             onChange={(e) => setCurrentPassword(e.target.value)}
                                             showValidation={false}
                                             error={null}
                                        />
                                   </div>
                                   <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={changingPassword}
                                        style={{ width: '100%' }}
                                        size="large"
                                   >
                                        Tiếp tục
                                   </Button>
                              </form>
                         )}

                         {/* Step 2: OTP Verification */}
                         {passwordStep === 2 && (
                              <form onSubmit={handleVerifyOtp}>
                                   <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                             Mã OTP
                                        </label>
                                        <Input
                                             value={otp}
                                             onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                             placeholder="Nhập mã OTP 6 số"
                                             size="large"
                                             maxLength={6}
                                        />
                                        {otpCountdown > 0 ? (
                                             <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff' }}>
                                                  Mã OTP sẽ hết hạn sau: {Math.floor(otpCountdown/60).toString().padStart(2, '0')}:{(otpCountdown%60).toString().padStart(2, '0')}
                                             </div>
                                        ) : (
                                             <Button
                                                  type="link"
                                                  onClick={handleResendOtp}
                                                  disabled={isOtpLoading}
                                                  style={{ padding: 0, marginTop: 8 }}
                                             >
                                                  Gửi lại OTP
                                             </Button>
                                        )}
                                        {otpError && (
                                             <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
                                                  {otpError}
                                             </div>
                                        )}
                                   </div>
                                   <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isOtpLoading}
                                        disabled={otp.length !== 6 || otpCountdown === 0}
                                        style={{ width: '100%' }}
                                        size="large"
                                   >
                                        Xác thực OTP
                                   </Button>
                              </form>
                         )}

                         {/* Step 3: New Password */}
                         {passwordStep === 3 && (
                              <form onSubmit={handlePasswordChange}>
                                   <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                             Mật khẩu mới
                                        </label>
                                        <PasswordInput
                                             label="Nhập mật khẩu mới"
                                             value={newPassword}
                                             onChange={(e) => setNewPassword(e.target.value)}
                                             showValidation={true}
                                             error={null}
                                        />
                                   </div>
                                   <div style={{ marginBottom: 24 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                             Xác nhận mật khẩu mới
                                        </label>
                                        <PasswordInput
                                             label="Nhập lại mật khẩu mới"
                                             value={confirmNewPassword}
                                             onChange={(e) => setConfirmNewPassword(e.target.value)}
                                             showValidation={false}
                                             confirmPassword={newPassword}
                                             error={null}
                                        />
                                   </div>
                                   <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={changingPassword}
                                        style={{ width: '100%' }}
                                        size="large"
                                   >
                                        Đổi mật khẩu
                                   </Button>
                              </form>
                         )}
                    </Modal>
               </div>
          </MainLayout>
     );
}

export default Profile;
