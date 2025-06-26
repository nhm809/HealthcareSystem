import { Card, Descriptions, Avatar, Button, Divider, Spin, Modal, Form, Input, Upload, message, DatePicker, Select, Tag } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import React, { useEffect, useState, useContext } from 'react';
import { authApi, getInfo } from '../../services/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import dayjs from 'dayjs';
import { faArrowLeft, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContext } from '../../contexts/ToastProvider';

function Profile() {
     const navigate = useNavigate();
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
     const [form] = Form.useForm();
     const [passwordForm] = Form.useForm();
     const [setAvatarFile] = useState(null);
     const [uploading, setUploading] = useState(false);
     const [changingPassword, setChangingPassword] = useState(false);
     const [uploadingAvatar, setUploadingAvatar] = useState(false);
     const { toast } = useContext(ToastContext);
     const [serviceHistory, setServiceHistory] = useState([]);
     const [historyLoading, setHistoryLoading] = useState(true);

     useEffect(() => {
          const userId = Cookies.get('userId');

          const fetchServiceHistory = async (memberId) => {
               try {
                    const response = await authApi.getTestServiceRecordsByMember(memberId);
                    setServiceHistory(response.data);
                    console.log(response.data);
               } catch (error) {
                    console.error('Failed to fetch service history:', error);
                    message.error('Không thể tải lịch sử dịch vụ');
               } finally {
                    setHistoryLoading(false);
               }
          };

          const fetchUserInfo = async () => {
               try {
                    setLoading(true);
                    setHistoryLoading(true);
                    
                    const response = await getInfo(userId);
                    
                    const userData = {
                         ...response.data,
                         dateOfBirth: response.data.doB || response.data.DoB,
                         avatar: response.data.avatarPath || response.data.avatar,
                         role: response.data.role
                    };
                    setUser(userData);

                    if (userData.role === 'MB') {
                         await fetchServiceHistory(userId);
                    } else {
                         setHistoryLoading(false);
                    }
                    setError(null);
               } catch (err) {
                    console.error('Error fetching user info:', err);
                    setError('Failed to load user information');
                    setHistoryLoading(false);
               } finally {
                    setLoading(false);
               }
          }

          if (userId) {
               fetchUserInfo();
          } else {
               setError('User ID not found');
               setLoading(false);
               setHistoryLoading(false);
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

               setUser(response.data);
               toast.success('Cập nhật thông tin thành công!');
               message.success('Cập nhật thông tin thành công!');
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
          setIsPasswordModalVisible(true);
     };

     const handlePasswordCancel = () => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
     };

     const handlePasswordChange = async (values) => {
          try {
               setChangingPassword(true);
               const userId = Cookies.get('userId');
               await authApi.changePassword(userId, values.currentPassword, values.newPassword);
               
               toast.success('Cập nhật thông tin thành công!');
               setIsPasswordModalVisible(false);
               passwordForm.resetFields();
          } catch (err) {
               console.error('Error changing password:', err);
               message.error('Đổi mật khẩu thất bại! Vui lòng kiểm tra lại mật khẩu hiện tại.');
          } finally {
               setChangingPassword(false);
          }
     };

     if (loading) {
          return (
               <MainLayout>
                    <div className="profile-loading">
                         <Spin size="large" />
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

     const renderServiceStatus = (status) => {
          const lowerCaseStatus = status?.toLowerCase() || '';
          switch (lowerCaseStatus) {
               case 'da hoan tat':
               case 'completed':
                    return <Tag color="success">Đã hoàn tất</Tag>;
               case 'dang cho kham':
               case 'processing':
               case 'waiting':
                    return <Tag color="processing">Đang thực hiện</Tag>;
               case 'dang thanh toan':
               case 'pending':
                    return <Tag color="warning">Chờ thanh toán</Tag>;
               case 'da huy':
               case 'cancelled':
               case 'khach hang khong den':
                    return <Tag color="default">Đã hủy</Tag>;
               default:
                    return <Tag>{status}</Tag>;
          }
     };

     const renderServiceAction = (record) => {
          const lowerCaseStatus = record.status?.toLowerCase() || '';
          switch (lowerCaseStatus) {
               case 'da hoan tat':
               case 'completed':
                    return <Button type="primary" ghost>Đánh giá dịch vụ</Button>;
               case 'da huy':
               case 'cancelled':
               case 'khach hang khong den':
                    return <span className="service-cancelled-text">Dịch vụ đã bị hủy</span>;
               default:
                    return null;
          }
     };

     return (
          <MainLayout>
               <Card className="profile-container">
                    <div className="profile-header">
                         <div>
                              <Avatar
                                   size={100}
                                   src={user.avatar}
                                   icon={<UserOutlined />}
                                   className="profile-avatar"
                              />
                         </div>
                         <div>
                              <h2 className="profile-info">{user.name}</h2>
                              <p className="profile-info">{user.email}</p>
                              <div className="profile-buttons">
                                   <Button type="primary" onClick={showModal} className="profile-edit-button">
                                        Chỉnh sửa hồ sơ
                                   </Button>
                                   <Button
                                        type="default"
                                        onClick={showPasswordModal}
                                        className="profile-edit-button"
                                        icon={<LockOutlined />}
                                   >
                                        Đổi mật khẩu
                                   </Button>
                              </div>
                         </div>
                    </div>
                    <Divider />

                    <Descriptions title="Thông tin chi tiết" bordered column={1}>
                         <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                         <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
                         {/* <Descriptions.Item label="Tên đăng nhập">{user.name}</Descriptions.Item> */}
                         <Descriptions.Item label="Số điện thoại">{user.phoneNumber}</Descriptions.Item>
                         <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
                         <Descriptions.Item label="Ngày sinh">
                              {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : ''}
                         </Descriptions.Item>
                         <Descriptions.Item label="Giới tính">{user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</Descriptions.Item>
                    </Descriptions>

                    {user && user.role === 'MB' && (
                         <>
                              <Divider />
                              <div className="service-history-container">
                                   <h3 className="service-history-title">
                                        <FontAwesomeIcon icon={faStethoscope} style={{ marginRight: '8px' }} /> Lịch sử dịch vụ
                                   </h3>
                                   {historyLoading ? (
                                        <div className="profile-loading" style={{marginTop: '20px'}}>
                                             <Spin />
                                        </div>
                                   ) : serviceHistory.length > 0 ? (
                                        <div className="service-history-list">
                                             {serviceHistory.map(record => (
                                                  <Card key={record.testServiceRecordId} className="service-record-card" bodyStyle={{ padding: '20px' }}>
                                                       <div className="service-record-header">
                                                            <div className="service-record-info">
                                                                 <p className="service-name">{record.serviceName}</p>
                                                                 <p className="service-date">
                                                                      <i className="far fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                                                      {dayjs(record.recordDate).format('DD/MM/YYYY')}
                                                                 </p>
                                                            </div>
                                                            <div className="service-record-status">
                                                                 {renderServiceStatus(record.status)}
                                                            </div>
                                                       </div>
                                                       <div className="service-record-action" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
                                                            {renderServiceAction(record)}
                                                       </div>
                                                  </Card>
                                             ))}
                                        </div>
                                   ) : (
                                        <p>Không có lịch sử dịch vụ để hiển thị.</p>
                                   )}
                              </div>
                         </>
                    )}

                    <Modal
                         title="Chỉnh sửa thông tin"
                         open={isModalVisible}
                         onCancel={handleCancel}
                         footer={null}
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

                              <Form.Item>
                                   <Button type="primary" htmlType="submit" loading={uploading || uploadingAvatar} disabled={uploadingAvatar}>
                                        Lưu thay đổi
                                   </Button>
                              </Form.Item>
                         </Form>
                    </Modal>

                    <Modal
                         title="Đổi mật khẩu"
                         open={isPasswordModalVisible}
                         onCancel={handlePasswordCancel}
                         footer={null}
                    >
                         <Form
                              form={passwordForm}
                              layout="vertical"
                              onFinish={handlePasswordChange}
                         >
                              <Form.Item
                                   label="Mật khẩu hiện tại"
                                   name="currentPassword"
                                   rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                              >
                                   <Input.Password />
                              </Form.Item>

                              <Form.Item
                                   label="Mật khẩu mới"
                                   name="newPassword"
                                   rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                   ]}
                              >
                                   <Input.Password />
                              </Form.Item>

                              <Form.Item
                                   label="Xác nhận mật khẩu mới"
                                   name="confirmPassword"
                                   dependencies={['newPassword']}
                                   rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                        ({ getFieldValue }) => ({
                                             validator(_, value) {
                                                  if (!value || getFieldValue('newPassword') === value) {
                                                       return Promise.resolve();
                                                  }
                                                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                             },
                                        }),
                                   ]}
                              >
                                   <Input.Password />
                              </Form.Item>

                              <Form.Item>
                                   <Button type="primary" htmlType="submit" loading={changingPassword}>
                                        Đổi mật khẩu
                                   </Button>
                              </Form.Item>
                         </Form>
                    </Modal>
               </Card>
          </MainLayout>
     );
}

export default Profile;
