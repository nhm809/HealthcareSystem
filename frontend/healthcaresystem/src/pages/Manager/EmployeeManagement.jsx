import React, { useState, useEffect } from 'react';
import {
     Table,
     Input,
     Select,
     Button,
     Modal,
     Descriptions,
     Tag,
     Avatar,
     Space,
     Card,
     Typography,
     Row,
     Col,
     Statistic,
     message,
     Spin,
     Tooltip,
     Badge,
     Switch,
     Modal as AntdModal,
     Upload,
     Form,
     DatePicker
} from 'antd';


import {
     SearchOutlined,
     EyeOutlined,
     UserOutlined,
     TeamOutlined,
     MedicineBoxOutlined,
     SettingOutlined,
     ReloadOutlined,
     FilterOutlined,
     UploadOutlined,
     DeleteOutlined,
     CalendarOutlined,
     ClockCircleOutlined,
     DownOutlined,
     UpOutlined
} from '@ant-design/icons';
import { specialtyApi, manageUserApi, authApi } from '../../services/api';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const EmployeeManagement = () => {
     const [users, setUsers] = useState([]);
     const [filteredUsers, setFilteredUsers] = useState([]);
     const [loading, setLoading] = useState(false);
     const [searchText, setSearchText] = useState('');
     const [roleFilter, setRoleFilter] = useState('all');
     const [statusFilter, setStatusFilter] = useState('available');
     const [selectedUser, setSelectedUser] = useState(null);
     const [detailModalVisible, setDetailModalVisible] = useState(false);
     const [editModalVisible, setEditModalVisible] = useState(false);
     const [editForm] = Form.useForm();
     const [uploading, setUploading] = useState(false);
     const [uploadingAvatar, setUploadingAvatar] = useState(false);
     const [specialties, setSpecialties] = useState([]);
     const [selectedSpecialties, setSelectedSpecialties] = useState([]);
     const [addingSpecialty, setAddingSpecialty] = useState(false);
     const [deletingSpecialty, setDeletingSpecialty] = useState(false);
     const [userSpecialties, setUserSpecialties] = useState({});
     const [userSchedules, setUserSchedules] = useState({});
     const [loadingSchedule, setLoadingSchedule] = useState(false);
     const [addScheduleModalVisible, setAddScheduleModalVisible] = useState(false);
     const [addScheduleForm] = Form.useForm();
     const [addingSchedule, setAddingSchedule] = useState(false);
     const [deletingSchedule, setDeletingSchedule] = useState(false);
     const [noteModalVisible, setNoteModalVisible] = useState(false);
     const [selectedNote, setSelectedNote] = useState('');
     const [expandedDays, setExpandedDays] = useState(new Set());


     // Fetch all users
     const fetchUsers = async () => {
          setLoading(true);
          try {
               const response = await manageUserApi.getAllUsers();
               console.log('API Response:', response);
               console.log('Response data:', response.data);

               // Ensure we're setting an array, handle different response structures
               const userData = Array.isArray(response.data) ? response.data :
                    (response.data?.data && Array.isArray(response.data.data)) ? response.data.data : [];

               console.log('Processed user data:', userData);
               setUsers(userData);
               setFilteredUsers(userData);
          } catch (error) {
               console.error('Error fetching users:', error);
               message.error('Không thể tải danh sách nhân viên');
               setUsers([]);
               setFilteredUsers([]);
          } finally {
               setLoading(false);
          }
     };

     // Fetch specialties
     const fetchSpecialties = async () => {
          try {
               const res = await specialtyApi.getAllSpecialties();
               setSpecialties(res.data.data || []);
          } catch {
               setSpecialties([]);
          }
     };

     // Fetch specialties for a specific user
     const fetchUserSpecialties = async (userId) => {
          try {
               const res = await specialtyApi.getSpecialtiesByUserId(userId);
               return res.data.data || [];
          } catch (err) {
               console.error('Error fetching user specialties:', err);
               return [];
          }
     };

     // Fetch work schedule for a specific user
     const fetchUserSchedule = async (userId) => {
          try {
               setLoadingSchedule(true);
               const res = await manageUserApi.getUserSchedule(userId);
               return res.data || [];
          } catch (err) {
               console.error('Error fetching user schedule:', err);
               return [];
          } finally {
               setLoadingSchedule(false);
          }
     };

     useEffect(() => {
          fetchUsers();
     }, []);

     // Filter users based on search text and role
     useEffect(() => {
          if (!Array.isArray(users)) {
               setFilteredUsers([]);
               return;
          }

          let filtered = users;

          // Filter by search text (name or email)
          if (searchText) {
               filtered = filtered.filter(user =>
                    user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchText.toLowerCase())
               );
          }

          // Filter by role
          if (roleFilter !== 'all') {
               if (roleFilter === 'CN') {
                    filtered = filtered.filter(user => user.roleId === 'CS');
               } else {
                    filtered = filtered.filter(user => user.roleId === roleFilter);
               }
          }

          // Filter by account status
          if (statusFilter !== 'all') {
               filtered = filtered.filter(user => statusFilter === 'available' ? user.isAvailable : !user.isAvailable);
          }

          setFilteredUsers(filtered);
     }, [users, searchText, roleFilter, statusFilter]);

     // Get role display name
     const getRoleDisplayName = (roleId) => {
          const roleMap = {
               'MB': 'Thành viên',
               'ST': 'Nhân viên xét nghiệm',
               'CN': 'Tư vấn viên',
               'CS': 'Tư vấn viên', // Add this line
               'MG': 'Quản lý'
          };
          return roleMap[roleId] || roleId;
     };

     // Get role color
     const getRoleColor = (roleId) => {
          const colorMap = {
               'MB': 'blue',
               'ST': 'green',
               'CN': 'purple',
               'CS': 'purple', // Add this line
               'MG': 'red'
          };
          return colorMap[roleId] || 'default';
     };

     // Get day of week name
     const getDayName = (dayOfWeek) => {
          const dayMap = {
               0: 'Chủ nhật',
               1: 'Thứ 2',
               2: 'Thứ 3',
               3: 'Thứ 4',
               4: 'Thứ 5',
               5: 'Thứ 6',
               6: 'Thứ 7'
          };
          return dayMap[dayOfWeek] || `Ngày ${dayOfWeek}`;
     };

     // Get shift type name
     const getShiftTypeName = (shiftType) => {
          const shiftMap = {
               1: 'Ca sáng',
               2: 'Ca chiều'
          };
          return shiftMap[shiftType] || `Ca ${shiftType}`;
     };

     // Format time
     const formatTime = (timeString) => {
          if (!timeString) return '';
          return timeString.substring(0, 5); // Remove seconds
     };

     // Table columns
     const columns = [
          {
               title: 'Thông tin',
               key: 'info',
               width: 200,
               render: (_, record) => (
                    <Space>
                         <Avatar
                              size={40}
                              src={record.avatar}
                              icon={<UserOutlined />}
                         />
                         <div>
                              <div style={{ fontWeight: 600, color: '#1890ff' }}>
                                   {record.fullName || 'Chưa cập nhật'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                   {record.email}
                              </div>
                         </div>
                    </Space>
               ),
          },
          {
               title: 'Vai trò',
               dataIndex: 'roleId',
               key: 'roleId',
               width: 120,
               render: (roleId) => (
                    <Tag color={getRoleColor(roleId)}>
                         {getRoleDisplayName(roleId)}
                    </Tag>
               ),
          },
          {
               title: 'Trạng thái',
               dataIndex: 'isAvailable',
               key: 'isAvailable',
               width: 120,
               render: (isAvailable) => (
                    <Badge
                         status={isAvailable ? 'success' : 'error'}
                         text={isAvailable ? 'Khả dụng' : 'Không khả dụng'}
                    />
               ),
          },
          {
               title: 'Ngày tạo',
               dataIndex: 'createDate',
               key: 'createDate',
               width: 120,
               render: (date) => dayjs(date).format('DD/MM/YYYY'),
          },
     ];

     // Calculate statistics
     const stats = {
          staff: Array.isArray(users) ? users.filter(u => u.roleId === 'ST').length : 0,
          consultants: Array.isArray(users) ? users.filter(u => u.roleId === 'CN' || u.roleId === 'CS').length : 0,
          total: Array.isArray(users) ? users.filter(u => u.roleId === 'ST' || u.roleId === 'CN' || u.roleId === 'CS').length : 0,
          members: Array.isArray(users) ? users.filter(u => u.roleId === 'CN' || u.roleId === 'CS').length : 0, // now members = consultants
          managers: Array.isArray(users) ? users.filter(u => u.roleId === 'MG').length : 0,
          available: Array.isArray(users) ? users.filter(u => u.isAvailable).length : 0,
     };

     // Hàm upload ảnh lên Cloudinary
     const uploadToCloudinary = async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'healthcare');
          const response = await fetch('https://api.cloudinary.com/v1_1/dktu0nbjx/image/upload', {
               method: 'POST',
               body: formData,
          });
          const data = await response.json();
          return data.secure_url;
     };

     const handleAvatarChange = async (info) => {
          if (info.file.status === 'removed') {
               editForm.setFieldValue('avatarPath', '');
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
               editForm.setFieldValue('avatarPath', url);
               message.success('Tải ảnh lên thành công!');
          } catch {
               message.error('Tải ảnh lên thất bại!');
          } finally {
               setUploadingAvatar(false);
          }
     };

     // Show edit modal and load specialties if consultant
     const showEditModal = async () => {
          if (!selectedUser) return;
          editForm.setFieldsValue({
               fullName: selectedUser.fullName,
               email: selectedUser.email,
               phoneNumber: selectedUser.phoneNumber,
               address: selectedUser.address,
               dateOfBirth: selectedUser.doB ? dayjs(selectedUser.doB) : null,
               gender: selectedUser.gender,
               avatarPath: selectedUser.avatar,
          });
          if (selectedUser.roleId === 'CS') {
               fetchSpecialties();
               const userSpecialtiesData = await fetchUserSpecialties(selectedUser.userId);
               setSelectedSpecialties(userSpecialtiesData);
          } else {
               setSelectedSpecialties([]);
          }
          setEditModalVisible(true);
     };

     const handleEditCancel = () => {
          setEditModalVisible(false);
          editForm.resetFields();
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
               const userId = selectedUser.userId;
               const response = await authApi.updateUserInfo(userId, filteredData);
               // Cập nhật lại selectedUser, users, filteredUsers
               setSelectedUser({ ...selectedUser, ...response.data });
               setUsers(users.map(u => u.userId === userId ? { ...u, ...response.data } : u));
               setFilteredUsers(filteredUsers.map(u => u.userId === userId ? { ...u, ...response.data } : u));

               // Refresh user specialties if consultant
               if (selectedUser.roleId === 'CS') {
                    const userSpecialtiesData = await fetchUserSpecialties(userId);
                    setUserSpecialties(prev => ({
                         ...prev,
                         [userId]: userSpecialtiesData
                    }));
               }

               message.success('Cập nhật thông tin thành công!');
               setEditModalVisible(false);
               editForm.resetFields();
          } catch (err) {
               console.error('Error updating profile:', err);
               message.error('Cập nhật thông tin thất bại!');
          } finally {
               setUploading(false);
          }
     };

     // Add specialty handler
     const handleAddSpecialty = async (specialtyId) => {
          if (!selectedUser) return;
          setAddingSpecialty(true);
          try {
               await manageUserApi.addSpecialty(selectedUser.userId, specialtyId);
               // Update local state
               const added = specialties.find(s => s.id === specialtyId);
               if (added && !selectedSpecialties.some(s => s.id === specialtyId)) {
                    setSelectedSpecialties([...selectedSpecialties, added]);
               }
               message.success('Thêm chuyên khoa thành công!');
          } catch {
               message.error('Thêm chuyên khoa thất bại!');
          } finally {
               setAddingSpecialty(false);
          }
     };

     // Delete specialty handler
     const handleDeleteSpecialty = async (specialtyId) => {
          if (!selectedUser) return;
          setDeletingSpecialty(true);
          try {
               await manageUserApi.deleteSpecialty(selectedUser.userId, specialtyId);
               // Update local state
               setSelectedSpecialties(selectedSpecialties.filter(s => s.id !== specialtyId));
               setUserSpecialties(prev => ({
                    ...prev,
                    [selectedUser.userId]: (prev[selectedUser.userId] || []).filter(s => s.id !== specialtyId)
               }));
               message.success('Xóa chuyên khoa thành công!');
          } catch {
               message.error('Xóa chuyên khoa thất bại!');
          } finally {
               setDeletingSpecialty(false);
          }
     };

     // Show add schedule modal
     const showAddScheduleModal = () => {
          if (!selectedUser) return;
          addScheduleForm.resetFields();
          addScheduleForm.setFieldsValue({
               userId: selectedUser.userId,
               note: ''
          });
          setAddScheduleModalVisible(true);
     };

     // Handle add schedule
     const handleAddSchedule = async (values) => {
          if (!selectedUser) return;

          // Check if user has correct role (backend expects ST or CT, but system uses CS)
          if (selectedUser.roleId !== 'ST' && selectedUser.roleId !== 'CS') {
               message.error('Chỉ có thể thêm lịch làm việc cho nhân viên xét nghiệm hoặc tư vấn viên!');
               return;
          }

          setAddingSchedule(true);
          try {
               console.log('Selected user:', selectedUser);
               console.log('Sending schedule data:', values);
               console.log('User role:', selectedUser.roleId);

               // Ensure values are properly formatted
               const scheduleData = {
                    userId: selectedUser.userId, // Use selectedUser.userId instead of values.userId
                    dayOfWeek: parseInt(values.dayOfWeek),
                    shiftType: parseInt(values.shiftType),
                    note: values.note || ""
               };

               console.log('Formatted schedule data:', scheduleData);

               await manageUserApi.addWorkSchedule(scheduleData);
               // Refresh user schedule
               const userScheduleData = await fetchUserSchedule(selectedUser.userId);
               setUserSchedules(prev => ({
                    ...prev,
                    [selectedUser.userId]: userScheduleData
               }));
               message.success('Thêm lịch làm việc thành công!');
               setAddScheduleModalVisible(false);
               addScheduleForm.resetFields();
          } catch (err) {
               console.error('Error adding schedule:', err);
               console.error('Error response:', err.response?.data);
               console.error('Error status:', err.response?.status);
               console.error('Error message:', err.message);
               message.error(`Thêm lịch làm việc thất bại: ${err.response?.data?.message || err.message}`);
          } finally {
               setAddingSchedule(false);
          }
     };

     // Handle delete schedule
     const handleDeleteSchedule = async (weeklyScheduleId) => {
          if (!selectedUser) return;
          setDeletingSchedule(true);
          try {
               await manageUserApi.deleteWorkSchedule(weeklyScheduleId);
               // Refresh user schedule
               const userScheduleData = await fetchUserSchedule(selectedUser.userId);
               setUserSchedules(prev => ({
                    ...prev,
                    [selectedUser.userId]: userScheduleData
               }));
               message.success('Xóa lịch làm việc thành công!');
          } catch (err) {
               console.error('Error deleting schedule:', err);
               message.error('Xóa lịch làm việc thất bại!');
          } finally {
               setDeletingSchedule(false);
          }
     };

     // Show note modal
     const showNoteModal = (note) => {
          setSelectedNote(note);
          setNoteModalVisible(true);
     };

     // Toggle day expansion
     const toggleDayExpansion = (dayIndex) => {
          setExpandedDays(prev => {
               const newSet = new Set(prev);
               if (newSet.has(dayIndex)) {
                    newSet.delete(dayIndex);
               } else {
                    newSet.add(dayIndex);
               }
               return newSet;
          });
     };

     return (
          <div style={{ padding: '20px' }}>
               <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>
                    <TeamOutlined style={{ marginRight: '12px' }} />
                    Quản lý nhân viên
               </Title>

               {/* Statistics Cards */}
               <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Tổng số nhân viên"
                                   value={stats.total}
                                   prefix={<TeamOutlined />}
                                   valueStyle={{ color: '#1890ff' }}
                              />
                         </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Tư vấn viên"
                                   value={stats.members}
                                   prefix={<UserOutlined />}
                                   valueStyle={{ color: '#722ed1' }}
                              />
                         </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Nhân viên xét nghiệm"
                                   value={stats.staff}
                                   prefix={<MedicineBoxOutlined />}
                                   valueStyle={{ color: '#fa8c16' }}
                              />
                         </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Khả dụng"
                                   value={stats.available}
                                   prefix={<SettingOutlined />}
                                   valueStyle={{ color: '#722ed1' }}
                              />
                         </Card>
                    </Col>
               </Row>

               {/* Search and Filter */}
               <Card style={{ marginBottom: '16px' }}>
                    <Row gutter={[16, 16]} align="middle">
                         <Col xs={24} md={8}>
                              <Search
                                   placeholder="Tìm kiếm theo tên hoặc email..."
                                   value={searchText}
                                   onChange={(e) => setSearchText(e.target.value)}
                                   prefix={<SearchOutlined />}
                                   allowClear
                              />
                         </Col>
                         <Col xs={24} md={6}>
                              <Select
                                   placeholder="Lọc theo vai trò"
                                   value={roleFilter}
                                   onChange={setRoleFilter}
                                   style={{ width: '100%' }}
                                   prefix={<FilterOutlined />}
                              >
                                   <Option value="all">Tất cả vai trò</Option>
                                   <Option value="MB">Thành viên</Option>
                                   <Option value="ST">Nhân viên xét nghiệm</Option>
                                   <Option value="CN">Tư vấn viên</Option>
                                   <Option value="MG">Quản lý</Option>
                              </Select>
                         </Col>
                         <Col xs={24} md={6}>
                              <Select
                                   placeholder="Lọc theo trạng thái tài khoản"
                                   value={statusFilter}
                                   onChange={setStatusFilter}
                                   style={{ width: '100%' }}
                              >
                                   <Option value="all">Tất cả trạng thái</Option>
                                   <Option value="available">Tài khoản khả dụng</Option>
                                   <Option value="unavailable">Không khả dụng</Option>
                              </Select>
                         </Col>
                         <Col xs={24} md={4}>
                              <Button
                                   type="primary"
                                   icon={<ReloadOutlined />}
                                   onClick={fetchUsers}
                                   loading={loading}
                                   style={{ width: '100%' }}
                              >
                                   Làm mới
                              </Button>
                         </Col>
                         <Col xs={24} md={6}>
                              <Text type="secondary">
                                   Hiển thị {filteredUsers.length} / {users.length} nhân viên
                              </Text>
                         </Col>
                    </Row>
               </Card>

               {/* Table */}
               <Card>
                    <Table
                         columns={columns}
                         dataSource={filteredUsers}
                         rowKey="userId"
                         loading={loading}
                         pagination={{
                              pageSize: 10,
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total, range) =>
                                   `${range[0]}-${range[1]} của ${total} nhân viên`,
                              pageSizeOptions: ['10', '20', '50'],
                         }}
                         scroll={{ x: 1200 }}
                         size="middle"
                         onRow={(record) => ({
                              onClick: async () => {
                                   setSelectedUser(record);
                                   setDetailModalVisible(true);
                                   // Fetch specialties for consultant
                                   if (record.roleId === 'CS') {
                                        const userSpecialtiesData = await fetchUserSpecialties(record.userId);
                                        setUserSpecialties(prev => ({
                                             ...prev,
                                             [record.userId]: userSpecialtiesData
                                        }));
                                   }
                                   // Fetch work schedule for staff and consultants
                                   if (record.roleId === 'ST' || record.roleId === 'CS') {
                                        const userScheduleData = await fetchUserSchedule(record.userId);
                                        setUserSchedules(prev => ({
                                             ...prev,
                                             [record.userId]: userScheduleData
                                        }));
                                   }
                              },
                              style: { cursor: 'pointer' }
                         })}
                    />
               </Card>

               {/* Detail Modal */}
               <Modal
                    title={
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                   width: 40,
                                   height: 40,
                                   borderRadius: '50%',
                                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   color: 'white',
                                   fontSize: 18
                              }}>
                                   <UserOutlined />
                              </div>
                              <div>
                                   <div style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                                        Chi tiết nhân viên
                                   </div>
                              </div>
                         </div>
                    }
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                         <Button key="close" onClick={() => setDetailModalVisible(false)} style={{
                              background: '#f0f0f0',
                              border: '1px solid #d9d9d9',
                              color: '#666',
                              fontWeight: 500
                         }}>
                              Đóng
                         </Button>
                    ]}
                    width="80%"
                    styles={{
                         header: {
                              borderBottom: '1px solid #f0f0f0',
                              padding: '20px 24px'
                         },
                         body: {
                              padding: '32px 24px'
                         },
                         footer: {
                              borderTop: '1px solid #f0f0f0',
                              padding: '16px 24px'
                         }
                    }}
               >
                    {selectedUser && (
                         <div style={{ maxWidth: '100%' }}>
                              {/* Header Section */}
                              <div style={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: 24,
                                   marginBottom: 32,
                                   padding: '24px',
                                   background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                   borderRadius: 16,
                                   border: '1px solid #e8e8e8'
                              }}>
                                   <Avatar
                                        size={100}
                                        src={selectedUser.avatar}
                                        icon={<UserOutlined />}
                                        style={{
                                             border: '4px solid white',
                                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}
                                   />
                                   <div style={{ flex: 1 }}>
                                        <div style={{
                                             fontSize: 28,
                                             fontWeight: 700,
                                             color: '#1a1a1a',
                                             marginBottom: 8
                                        }}>
                                             {selectedUser.fullName || 'Chưa cập nhật'}
                                        </div>
                                        <div style={{
                                             fontSize: 16,
                                             color: '#666',
                                             marginBottom: 12
                                        }}>
                                             {selectedUser.email}
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                             <Tag color={getRoleColor(selectedUser.roleId)} style={{
                                                  fontSize: 14,
                                                  fontWeight: 600,
                                                  padding: '6px 12px',
                                                  borderRadius: 20
                                             }}>
                                                  {getRoleDisplayName(selectedUser.roleId)}
                                             </Tag>
                                             <Badge
                                                  status={selectedUser.isAvailable ? 'success' : 'error'}
                                                  text={selectedUser.isAvailable ? 'Khả dụng' : 'Không khả dụng'}
                                                  style={{ fontSize: 14, fontWeight: 500 }}
                                             />
                                        </div>
                                   </div>
                                   <div style={{
                                        textAlign: 'right',
                                        color: '#666',
                                        fontSize: 14
                                   }}>
                                        <div>ID: {selectedUser.userId}</div>
                                        <div>Ngày tạo: {dayjs(selectedUser.createDate).format('DD/MM/YYYY')}</div>
                                   </div>
                              </div>

                              {/* Information Grid */}
                              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                                   <Col xs={24} md={12}>
                                        <Card
                                             title={
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                       <UserOutlined style={{ color: '#1890ff' }} />
                                                       <span style={{ fontWeight: 600 }}>Thông tin cá nhân</span>
                                                       <Button type="link" onClick={showEditModal} style={{ marginLeft: 'auto' }}>
                                                            Chỉnh sửa
                                                       </Button>
                                                  </div>
                                             }
                                             style={{
                                                  borderRadius: 12,
                                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                  border: '1px solid #f0f0f0'
                                             }}
                                             headStyle={{
                                                  borderBottom: '2px solid #f0f0f0',
                                                  background: '#fafafa'
                                             }}
                                        >
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                       <span style={{ color: '#666', fontWeight: 500 }}>Số điện thoại:</span>
                                                       <span style={{ fontWeight: 600 }}>{selectedUser.phoneNumber || 'Chưa cập nhật'}</span>
                                                  </div>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                       <span style={{ color: '#666', fontWeight: 500 }}>Ngày sinh:</span>
                                                       <span style={{ fontWeight: 600 }}>{selectedUser.doB ? dayjs(selectedUser.doB).format('DD/MM/YYYY') : 'Chưa cập nhật'}</span>
                                                  </div>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                       <span style={{ color: '#666', fontWeight: 500 }}>Giới tính:</span>
                                                       <span style={{ fontWeight: 600 }}>{selectedUser.gender || 'Chưa cập nhật'}</span>
                                                  </div>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                       <span style={{ color: '#666', fontWeight: 500 }}>Địa chỉ:</span>
                                                       <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{selectedUser.address || 'Chưa cập nhật'}</span>
                                                  </div>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                       <span style={{ color: '#666', fontWeight: 500 }}>Loại tài khoản:</span>
                                                       <span style={{ fontWeight: 600 }}>{selectedUser.provider}</span>
                                                  </div>
                                             </div>
                                        </Card>
                                   </Col>

                                   <Col xs={24} md={12}>
                                        <Card
                                             title={
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                       <SettingOutlined style={{ color: '#52c41a' }} />
                                                       <span style={{ fontWeight: 600 }}>Cài đặt tài khoản</span>
                                                  </div>
                                             }
                                             style={{
                                                  borderRadius: 12,
                                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                  border: '1px solid #f0f0f0'
                                             }}
                                             headStyle={{
                                                  borderBottom: '2px solid #f0f0f0',
                                                  background: '#fafafa'
                                             }}
                                        >
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                  {/* Status Toggle */}
                                                  <div style={{
                                                       padding: '16px',
                                                       background: selectedUser.isAvailable ? '#f6ffed' : '#fff2f0',
                                                       border: `1px solid ${selectedUser.isAvailable ? '#b7eb8f' : '#ffccc7'}`,
                                                       borderRadius: 8
                                                  }}>
                                                       <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: 12
                                                       }}>
                                                            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Trạng thái tài khoản</span>
                                                            <Switch
                                                                 checked={selectedUser.isAvailable}
                                                                 onChange={() => {
                                                                      AntdModal.confirm({
                                                                           title: `Xác nhận thay đổi trạng thái tài khoản`,
                                                                           content: selectedUser.isAvailable ? 'Bạn có chắc muốn chuyển tài khoản sang trạng thái KHÔNG khả dụng?' : 'Bạn có chắc muốn chuyển tài khoản sang trạng thái KHẢ DỤNG?',
                                                                           okText: 'Xác nhận',
                                                                           cancelText: 'Hủy',
                                                                           onOk: async () => {
                                                                                const checked = !selectedUser.isAvailable;
                                                                                try {
                                                                                     setLoading(true);
                                                                                     await manageUserApi.updateUserAvailabilityToggle(selectedUser.userId, checked);
                                                                                     setSelectedUser({ ...selectedUser, isAvailable: checked });
                                                                                     setUsers(users.map(u => u.userId === selectedUser.userId ? { ...u, isAvailable: checked } : u));
                                                                                     setFilteredUsers(filteredUsers.map(u => u.userId === selectedUser.userId ? { ...u, isAvailable: checked } : u));
                                                                                     message.success('Đã cập nhật trạng thái tài khoản!');
                                                                                } catch {
                                                                                     message.error('Cập nhật trạng thái thất bại!');
                                                                                } finally {
                                                                                     setLoading(false);
                                                                                }
                                                                           }
                                                                      });
                                                                 }}
                                                            />
                                                       </div>
                                                       <Badge
                                                            status={selectedUser.isAvailable ? 'success' : 'error'}
                                                            text={selectedUser.isAvailable ? 'Tài khoản đang hoạt động bình thường' : 'Tài khoản đã bị vô hiệu hóa'}
                                                            style={{ fontSize: 14 }}
                                                       />
                                                  </div>

                                                  {/* Role Update */}
                                                  <div style={{
                                                       padding: '16px',
                                                       background: '#f0f8ff',
                                                       border: '1px solid #bae7ff',
                                                       borderRadius: 8
                                                  }}>
                                                       <div style={{
                                                            marginBottom: 12,
                                                            fontWeight: 600,
                                                            color: '#1a1a1a'
                                                       }}>
                                                            Thay đổi vai trò
                                                       </div>
                                                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                            <Select
                                                                 value={selectedUser.roleId}
                                                                 style={{ width: 180 }}
                                                                 onChange={async (newRole) => {
                                                                      const currentRoleName = getRoleDisplayName(selectedUser.roleId);
                                                                      const newRoleName = getRoleDisplayName(newRole);

                                                                      AntdModal.confirm({
                                                                           title: 'Xác nhận thay đổi vai trò',
                                                                           content: `Bạn có chắc muốn thay đổi vai trò của ${selectedUser.fullName || 'nhân viên này'} từ "${currentRoleName}" sang "${newRoleName}"?`,
                                                                           okText: 'Xác nhận',
                                                                           cancelText: 'Hủy',
                                                                           onOk: async () => {
                                                                                try {
                                                                                     setLoading(true);
                                                                                     await manageUserApi.updateUserRole(selectedUser.userId, newRole);
                                                                                     setSelectedUser({ ...selectedUser, roleId: newRole });
                                                                                     setUsers(users.map(u => u.userId === selectedUser.userId ? { ...u, roleId: newRole } : u));
                                                                                     setFilteredUsers(filteredUsers.map(u => u.userId === selectedUser.userId ? { ...u, roleId: newRole } : u));

                                                                                     // If role changed to consultant, fetch specialties
                                                                                     if (newRole === 'CS') {
                                                                                          const userSpecialtiesData = await fetchUserSpecialties(selectedUser.userId);
                                                                                          setUserSpecialties(prev => ({
                                                                                               ...prev,
                                                                                               [selectedUser.userId]: userSpecialtiesData
                                                                                          }));
                                                                                     }

                                                                                     message.success('Cập nhật vai trò thành công!');
                                                                                } catch {
                                                                                     message.error('Cập nhật vai trò thất bại!');
                                                                                } finally {
                                                                                     setLoading(false);
                                                                                }
                                                                           }
                                                                      });
                                                                 }}
                                                            >
                                                                 <Option value="MB">Thành viên</Option>
                                                                 <Option value="ST">Nhân viên xét nghiệm</Option>
                                                                 <Option value="CS">Tư vấn viên</Option>
                                                            </Select>
                                                            <Tag color={getRoleColor(selectedUser.roleId)} style={{
                                                                 fontWeight: 600,
                                                                 fontSize: 14,
                                                                 padding: '4px 12px',
                                                                 borderRadius: 16
                                                            }}>
                                                                 {getRoleDisplayName(selectedUser.roleId)}
                                                            </Tag>
                                                       </div>
                                                  </div>
                                             </div>
                                        </Card>
                                   </Col>
                              </Row>
                              {selectedUser && selectedUser.roleId === 'CS' && (
                                   <Card
                                        title={
                                             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                  <MedicineBoxOutlined style={{ color: '#fa8c16' }} />
                                                  <span style={{ fontWeight: 600 }}>Chuyên khoa tư vấn</span>
                                             </div>
                                        }
                                        style={{
                                             marginTop: 24,
                                             borderRadius: 12,
                                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                             border: '1px solid #f0f0f0',
                                             padding: 0
                                        }}
                                        headStyle={{
                                             borderBottom: '2px solid #f0f0f0',
                                             background: '#fafafa',
                                             fontSize: 16
                                        }}
                                        bodyStyle={{ padding: 24 }}
                                   >
                                        <div style={{ marginBottom: 20 }}>
                                             <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Danh sách chuyên khoa hiện tại:</div>
                                             <div style={{
                                                  minHeight: 32,
                                                  display: 'flex',
                                                  flexWrap: 'wrap',
                                                  gap: 8,
                                                  alignItems: 'center'
                                             }}>
                                                  {(userSpecialties[selectedUser.userId] && userSpecialties[selectedUser.userId].length > 0) ? (
                                                       userSpecialties[selectedUser.userId].map(s => (
                                                            <Tag
                                                                 key={s.id}
                                                                 color="blue"
                                                                 style={{
                                                                      fontSize: 13,
                                                                      padding: '2px 8px',
                                                                      borderRadius: 12,
                                                                      display: 'flex',
                                                                      alignItems: 'center',
                                                                      gap: 4,
                                                                      margin: 0
                                                                 }}
                                                                 closable
                                                                 onClose={() => {
                                                                      AntdModal.confirm({
                                                                           title: 'Xác nhận xóa chuyên khoa',
                                                                           content: `Bạn có chắc muốn xóa chuyên khoa "${s.name}" khỏi ${selectedUser.fullName || 'tư vấn viên này'}?`,
                                                                           okText: 'Xóa',
                                                                           cancelText: 'Hủy',
                                                                           okType: 'danger',
                                                                           onOk: () => handleDeleteSpecialty(s.id)
                                                                      });
                                                                 }}
                                                            >
                                                                 {s.name}
                                                            </Tag>
                                                       ))
                                                  ) : (
                                                       <span style={{ color: '#888' }}>Chưa có chuyên khoa nào</span>
                                                  )}
                                             </div>
                                        </div>
                                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                             <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Thêm chuyên khoa:</span>
                                             <Select
                                                  placeholder="Chọn chuyên khoa để thêm"
                                                  style={{ width: 260 }}
                                                  onFocus={fetchSpecialties}
                                                  onChange={async (specialtyId) => {
                                                       await handleAddSpecialty(specialtyId);
                                                       // Update userSpecialties state
                                                       const added = specialties.find(s => s.id === specialtyId);
                                                       if (added && !(userSpecialties[selectedUser.userId] || []).some(s => s.id === specialtyId)) {
                                                            setUserSpecialties(prev => ({
                                                                 ...prev,
                                                                 [selectedUser.userId]: [...(prev[selectedUser.userId] || []), added]
                                                            }));
                                                       }
                                                  }}
                                                  loading={addingSpecialty}
                                                  value={null}
                                             >
                                                  {specialties.filter(s => !((userSpecialties[selectedUser.userId] || []).some(sel => sel.id === s.id))).map(s => (
                                                       <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                                                  ))}
                                             </Select>
                                        </div>
                                   </Card>
                              )}

                              {/* Work Schedule Card for Staff and Consultants */}
                              {(selectedUser && (selectedUser.roleId === 'ST' || selectedUser.roleId === 'CS')) && (
                                   <Card
                                        title={
                                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', width: '100%' }}>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                       <CalendarOutlined style={{ color: '#fa8c16' }} />
                                                       <span style={{ fontWeight: 600 }}>Lịch làm việc</span>
                                                  </div>
                                                  <Button
                                                       type="primary"
                                                       size="small"
                                                       icon={<CalendarOutlined />}
                                                       onClick={showAddScheduleModal}
                                                       style={{
                                                            background: '#fa8c16',
                                                            borderColor: '#fa8c16',
                                                            borderRadius: 6
                                                       }}
                                                  >
                                                       Thêm lịch
                                                  </Button>
                                             </div>
                                        }
                                        style={{
                                             marginTop: 24,
                                             borderRadius: 12,
                                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                             border: '1px solid #f0f0f0'
                                        }}
                                        headStyle={{
                                             borderBottom: '2px solid #f0f0f0',
                                             background: '#fafafa'
                                        }}
                                        bodyStyle={{ padding: 24 }}
                                   >
                                        <div style={{ marginBottom: 16 }}>
                                             <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
                                                  Lịch làm việc hàng tuần:
                                             </div>
                                             {loadingSchedule ? (
                                                  <div style={{ textAlign: 'center', padding: '20px' }}>
                                                       <Spin size="large" />
                                                  </div>
                                             ) : (userSchedules[selectedUser.userId] && userSchedules[selectedUser.userId].length > 0) ? (
                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                       {/* Group schedules by day */}
                                                       {Array.from({ length: 7 }, (_, dayIndex) => {
                                                            const daySchedules = userSchedules[selectedUser.userId]
                                                                 .filter(s => s.dayOfWeek === dayIndex)
                                                                 .sort((a, b) => a.shiftType - b.shiftType);

                                                            if (daySchedules.length === 0) return null;

                                                            return (
                                                                 <div
                                                                      key={dayIndex}
                                                                      style={{
                                                                           background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                                                           border: '1px solid #e8e8e8',
                                                                           borderRadius: 12,
                                                                           overflow: 'hidden',
                                                                           boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                                                      }}
                                                                 >
                                                                      {/* Day Header */}
                                                                      <div
                                                                           style={{
                                                                                background: '#f5f5f5',
                                                                                color: '#333',
                                                                                padding: '12px 16px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: 12,
                                                                                borderBottom: '1px solid #e8e8e8',
                                                                                cursor: 'pointer'
                                                                           }}
                                                                           onClick={() => toggleDayExpansion(dayIndex)}
                                                                      >
                                                                           <div style={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '50%',
                                                                                background: '#1890ff',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                color: 'white',
                                                                                fontWeight: 600,
                                                                                fontSize: 12
                                                                           }}>
                                                                                {dayIndex === 0 ? 'CN' : `T${dayIndex + 1}`}
                                                                           </div>
                                                                           <div style={{ fontWeight: 600, fontSize: 16, color: '#333', flex: 1 }}>
                                                                                {getDayName(dayIndex)}
                                                                           </div>
                                                                           <div style={{
                                                                                fontSize: 12,
                                                                                color: '#666',
                                                                                background: '#e6f7ff',
                                                                                padding: '2px 8px',
                                                                                borderRadius: 12,
                                                                                marginRight: 8
                                                                           }}>
                                                                                {daySchedules.length} ca
                                                                           </div>
                                                                           {expandedDays.has(dayIndex) ? (
                                                                                <UpOutlined style={{ color: '#666', fontSize: 12 }} />
                                                                           ) : (
                                                                                <DownOutlined style={{ color: '#666', fontSize: 12 }} />
                                                                           )}
                                                                      </div>

                                                                      {/* Shifts */}
                                                                      {expandedDays.has(dayIndex) && (
                                                                           <div style={{ padding: '16px' }}>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                                                     {daySchedules.map((schedule, shiftIndex) => (
                                                                                          <div
                                                                                               key={schedule.weeklyScheduleId}
                                                                                               style={{
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    gap: 16,
                                                                                                    padding: '12px 16px',
                                                                                                    background: shiftIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                                                                                    border: '1px solid #f0f0f0',
                                                                                                    borderRadius: 8,
                                                                                                    position: 'relative',
                                                                                                    overflow: 'hidden'
                                                                                               }}
                                                                                          >
                                                                                               {/* Shift Type Badge */}
                                                                                               <div style={{
                                                                                                    width: 50,
                                                                                                    height: 50,
                                                                                                    borderRadius: '50%',
                                                                                                    background: schedule.shiftType === 1 ? '#52c41a' : '#722ed1',
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    justifyContent: 'center',
                                                                                                    color: 'white',
                                                                                                    fontWeight: 600,
                                                                                                    fontSize: 11,
                                                                                                    border: '2px solid #f0f0f0'
                                                                                               }}>
                                                                                                    {schedule.shiftType === 1 ? 'SÁNG' : 'CHIỀU'}
                                                                                               </div>

                                                                                               {/* Time and Info */}
                                                                                               <div style={{ flex: 1 }}>
                                                                                                    <div style={{
                                                                                                         display: 'flex',
                                                                                                         justifyContent: 'space-between',
                                                                                                         alignItems: 'center',
                                                                                                         marginBottom: 4
                                                                                                    }}>
                                                                                                         <div style={{
                                                                                                              fontWeight: 600,
                                                                                                              color: '#1a1a1a',
                                                                                                              fontSize: 16
                                                                                                         }}>
                                                                                                              {getShiftTypeName(schedule.shiftType)}
                                                                                                         </div>
                                                                                                         <div style={{
                                                                                                              fontWeight: 600,
                                                                                                              color: '#333',
                                                                                                              fontSize: 16
                                                                                                         }}>
                                                                                                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                                                                         </div>
                                                                                                    </div>
                                                                                                    {schedule.note && (
                                                                                                         <div
                                                                                                              style={{
                                                                                                                   color: '#1890ff',
                                                                                                                   fontSize: 13,
                                                                                                                   marginTop: 4,
                                                                                                                   cursor: 'pointer',
                                                                                                                   display: 'flex',
                                                                                                                   alignItems: 'center',
                                                                                                                   gap: 4
                                                                                                              }}
                                                                                                              onClick={() => showNoteModal(schedule.note)}
                                                                                                         >
                                                                                                              📝 Xem ghi chú
                                                                                                         </div>
                                                                                                    )}
                                                                                               </div>

                                                                                               {/* Delete Button */}
                                                                                               <Button
                                                                                                    type="text"
                                                                                                    size="small"
                                                                                                    danger
                                                                                                    icon={<DeleteOutlined />}
                                                                                                    onClick={() => {
                                                                                                         AntdModal.confirm({
                                                                                                              title: 'Xác nhận xóa lịch làm việc',
                                                                                                              content: `Bạn có chắc muốn xóa lịch làm việc ${getDayName(schedule.dayOfWeek)} - ${getShiftTypeName(schedule.shiftType)}?`,
                                                                                                              okText: 'Xóa',
                                                                                                              cancelText: 'Hủy',
                                                                                                              okType: 'danger',
                                                                                                              onOk: () => handleDeleteSchedule(schedule.weeklyScheduleId)
                                                                                                         });
                                                                                                    }}
                                                                                                    style={{
                                                                                                         opacity: 0.7,
                                                                                                         transition: 'opacity 0.2s'
                                                                                                    }}
                                                                                                    onMouseEnter={(e) => e.target.style.opacity = 1}
                                                                                                    onMouseLeave={(e) => e.target.style.opacity = 0.7}
                                                                                               />
                                                                                          </div>
                                                                                     ))}
                                                                                </div>
                                                                           </div>
                                                                      )}
                                                                 </div>
                                                            );
                                                       }).filter(Boolean)}
                                                  </div>
                                             ) : (
                                                  <div style={{
                                                       textAlign: 'center',
                                                       padding: '20px',
                                                       color: '#888',
                                                       background: '#f8f9fa',
                                                       borderRadius: 8,
                                                       border: '1px dashed #d9d9d9'
                                                  }}>
                                                       <CalendarOutlined style={{ fontSize: 24, marginBottom: 8, display: 'block' }} />
                                                       Chưa có lịch làm việc
                                                  </div>
                                             )}
                                        </div>
                                   </Card>
                              )}
                         </div>
                    )}
               </Modal>

               {/* Modal thêm lịch làm việc */}
               <Modal
                    title={
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                   width: 40,
                                   height: 40,
                                   borderRadius: '50%',
                                   background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   color: 'white',
                                   fontSize: 18
                              }}>
                                   <CalendarOutlined />
                              </div>
                              <div>
                                   <div style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                                        Thêm lịch làm việc
                                   </div>
                                   <div style={{ fontSize: 14, color: '#666' }}>
                                        {selectedUser?.fullName || 'Nhân viên'}
                                   </div>
                              </div>
                         </div>
                    }
                    open={addScheduleModalVisible}
                    onCancel={() => setAddScheduleModalVisible(false)}
                    footer={null}
                    width={500}
                    styles={{
                         header: {
                              borderBottom: '1px solid #f0f0f0',
                              padding: '20px 24px'
                         },
                         body: {
                              padding: '32px 24px'
                         }
                    }}
               >
                    <Form
                         form={addScheduleForm}
                         layout="vertical"
                         onFinish={handleAddSchedule}
                    >
                         <Form.Item
                              label="Ngày trong tuần"
                              name="dayOfWeek"
                              rules={[{ required: true, message: 'Vui lòng chọn ngày trong tuần!' }]}
                         >
                              <Select placeholder="Chọn ngày trong tuần">
                                   <Select.Option value={0}>Chủ nhật</Select.Option>
                                   <Select.Option value={1}>Thứ 2</Select.Option>
                                   <Select.Option value={2}>Thứ 3</Select.Option>
                                   <Select.Option value={3}>Thứ 4</Select.Option>
                                   <Select.Option value={4}>Thứ 5</Select.Option>
                                   <Select.Option value={5}>Thứ 6</Select.Option>
                                   <Select.Option value={6}>Thứ 7</Select.Option>
                              </Select>
                         </Form.Item>

                         <Form.Item
                              label="Loại ca làm việc"
                              name="shiftType"
                              rules={[{ required: true, message: 'Vui lòng chọn loại ca làm việc!' }]}
                         >
                              <Select placeholder="Chọn loại ca làm việc">
                                   <Select.Option value={1}>Ca sáng</Select.Option>
                                   <Select.Option value={2}>Ca chiều</Select.Option>
                              </Select>
                         </Form.Item>

                         <Form.Item
                              label="Ghi chú"
                              name="note"
                         >
                              <Input.TextArea
                                   rows={3}
                                   placeholder="Nhập ghi chú (không bắt buộc)"
                                   maxLength={200}
                                   showCount
                              />
                         </Form.Item>

                         <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                              <Space>
                                   <Button onClick={() => setAddScheduleModalVisible(false)}>
                                        Hủy
                                   </Button>
                                   <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={addingSchedule}
                                        style={{
                                             background: '#fa8c16',
                                             borderColor: '#fa8c16'
                                        }}
                                   >
                                        Thêm lịch
                                   </Button>
                              </Space>
                         </Form.Item>
                    </Form>
               </Modal>

               {/* Modal hiển thị ghi chú */}
               <Modal
                    title={
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 16, fontWeight: 600 }}>📝 Ghi chú lịch làm việc</span>
                         </div>
                    }
                    open={noteModalVisible}
                    onCancel={() => setNoteModalVisible(false)}
                    footer={[
                         <Button key="close" onClick={() => setNoteModalVisible(false)}>
                              Đóng
                         </Button>
                    ]}
                    width={500}
               >
                    <div style={{
                         padding: '16px',
                         background: '#f8f9fa',
                         borderRadius: 8,
                         border: '1px solid #e8e8e8',
                         fontSize: 14,
                         lineHeight: 1.6,
                         color: '#333'
                    }}>
                         {selectedNote}
                    </div>
               </Modal>

               {/* Modal chỉnh sửa thông tin */}
               <Modal
                    title="Chỉnh sửa thông tin nhân viên"
                    open={editModalVisible}
                    onCancel={handleEditCancel}
                    footer={null}
               >
                    <Form
                         form={editForm}
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
                         {selectedUser && selectedUser.roleId === 'CS' && (
                              <Form.Item label="Chuyên khoa">
                                   <Select
                                        placeholder="Chọn chuyên khoa để thêm"
                                        onChange={handleAddSpecialty}
                                        loading={addingSpecialty}
                                        style={{ width: '100%' }}
                                        value={null}
                                   >
                                        {specialties.filter(s => !((selectedSpecialties || []).some(sel => sel.id === s.id))).map(s => (
                                             <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                                        ))}
                                   </Select>
                                   <div style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 6,
                                        alignItems: 'center'
                                   }}>
                                        {selectedSpecialties.length === 0 && <span>Chưa có chuyên khoa nào</span>}
                                        {selectedSpecialties.map(s => (
                                             <Tag
                                                  key={s.id}
                                                  color="blue"
                                                  style={{
                                                       fontSize: 13,
                                                       padding: '2px 8px',
                                                       borderRadius: 12,
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: 4,
                                                       margin: 0
                                                  }}
                                                  closable
                                                  onClose={() => {
                                                       AntdModal.confirm({
                                                            title: 'Xác nhận xóa chuyên khoa',
                                                            content: `Bạn có chắc muốn xóa chuyên khoa "${s.name}"?`,
                                                            okText: 'Xóa',
                                                            cancelText: 'Hủy',
                                                            okType: 'danger',
                                                            onOk: () => handleDeleteSpecialty(s.id)
                                                       });
                                                  }}
                                             >
                                                  {s.name}
                                             </Tag>
                                        ))}
                                   </div>
                              </Form.Item>
                         )}
                         <Form.Item>
                              <Button type="primary" htmlType="submit" loading={uploading || uploadingAvatar} disabled={uploadingAvatar}>
                                   Lưu thay đổi
                              </Button>
                         </Form.Item>
                    </Form>
               </Modal>
          </div>
     );
};

export default EmployeeManagement;