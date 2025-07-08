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
     Modal as AntdModal
} from 'antd';


import {
     SearchOutlined,
     EyeOutlined,
     UserOutlined,
     TeamOutlined,
     MedicineBoxOutlined,
     SettingOutlined,
     ReloadOutlined,
     FilterOutlined
} from '@ant-design/icons';
import { manageUserApi } from '../../services/api';
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
                                   <Option value="available">Khả dụng</Option>
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
                              onClick: () => {
                                   setSelectedUser(record);
                                   setDetailModalVisible(true);
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
                                                                                } catch (err) {
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
                                                                                     message.success('Cập nhật vai trò thành công!');
                                                                                } catch (err) {
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
                         </div>
                    )}
               </Modal>
          </div>
     );
};

export default EmployeeManagement;