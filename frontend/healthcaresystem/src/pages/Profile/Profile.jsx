import { Card, Descriptions, Avatar, Button, Divider, Spin, Modal, Form, Input, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import { authApi, getInfo } from '../../services/api';
import Cookies from 'js-cookie';

function Profile() {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [form] = Form.useForm();
     const [avatarFile, setAvatarFile] = useState(null);
     const [uploading, setUploading] = useState(false);

     useEffect(() => {
          const userId = Cookies.get('userId');
          const fetchUserInfo = async () => {
               try {
                    setLoading(true);
                    const response = await getInfo(userId);
                    setUser(response.data);
                    setError(null);
               } catch (err) {
                    console.error('Error fetching user info:', err);
                    setError('Failed to load user information');
               } finally {
                    setLoading(false);
               }
          };

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
               email: user?.email,
               phoneNumber: user?.phoneNumber,
               address: user?.address,
          });
          setIsModalVisible(true);
     };

     const handleCancel = () => {
          setIsModalVisible(false);
          form.resetFields();
          setAvatarFile(null);
     };

     const handleUpdateProfile = async (values) => {
          try {
               setUploading(true);
               const formData = new FormData();
               
               // Add user info to formData
               Object.keys(values).forEach(key => {
                    formData.append(key, values[key]);
               });

               // Add avatar if selected
               if (avatarFile) {
                    formData.append('avatar', avatarFile);
               }

               const userId = Cookies.get('userId');
               const response = await authApi.updateUserInfo(userId, formData);
               
               setUser(response.data);
               message.success('Cập nhật thông tin thành công!');
               setIsModalVisible(false);
               form.resetFields();
               setAvatarFile(null);
          } catch (err) {
               console.error('Error updating profile:', err);
               message.error('Cập nhật thông tin thất bại!');
          } finally {
               setUploading(false);
          }
     };

     const handleAvatarChange = (info) => {
          if (info.file.status === 'done') {
               setAvatarFile(info.file.originFileObj);
               message.success('Tải ảnh lên thành công!');
          } else if (info.file.status === 'error') {
               message.error('Tải ảnh lên thất bại!');
          }
     };

     if (loading) {
          return (
               <MainLayout>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                         <Spin size="large" />
                    </div>
               </MainLayout>
          );
     }

     if (error) {
          return (
               <MainLayout>
                    <Card style={{ maxWidth: 1000, margin: '20px auto', padding: 24 }}>
                         <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
                    </Card>
               </MainLayout>
          );
     }

     if (!user) {
          return null;
     }

     return (
          <MainLayout>
               <Card style={{ maxWidth: 1000, margin: '20px auto', padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                         <div>
                              <Avatar 
                                   size={100} 
                                   src={user.avatar} 
                                   icon={<UserOutlined />} 
                              />
                         </div>
                         <div>
                              <h2>{user.name}</h2>
                              <p>{user.email}</p>
                              <Button type="primary" onClick={showModal}>
                                   Chỉnh sửa hồ sơ
                              </Button>
                         </div>
                    </div>

                    <Divider />

                    <Descriptions title="Thông tin chi tiết" bordered column={1}>
                         <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                         <Descriptions.Item label="Số điện thoại">{user.phoneNumber}</Descriptions.Item>
                         <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
                    </Descriptions>

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
                                   name="avatar"
                              >
                                   <Upload
                                        name="avatar"
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        onChange={handleAvatarChange}
                                   >
                                        <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                   </Upload>
                              </Form.Item>

                              <Form.Item
                                   label="Họ và tên"
                                   name="name"
                                   rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item
                                   label="Email"
                                   name="email"
                                   rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                   ]}
                              >
                                   <Input disabled />
                              </Form.Item>

                              <Form.Item
                                   label="Số điện thoại"
                                   name="phoneNumber"
                                   rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item
                                   label="Địa chỉ"
                                   name="address"
                                   rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                              >
                                   <Input />
                              </Form.Item>

                              <Form.Item>
                                   <Button type="primary" htmlType="submit" loading={uploading}>
                                        Lưu thay đổi
                                   </Button>
                              </Form.Item>
                         </Form>
                    </Modal>
               </Card>
          </MainLayout>
     );
}

export default Profile;
