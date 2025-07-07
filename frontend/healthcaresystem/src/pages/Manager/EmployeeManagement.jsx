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
     Badge
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
               filtered = filtered.filter(user => user.roleId === roleFilter);
          }

          setFilteredUsers(filtered);
     }, [users, searchText, roleFilter]);

     // Get role display name
     const getRoleDisplayName = (roleId) => {
          const roleMap = {
               'MB': 'Thành viên',
               'ST': 'Nhân viên',
               'CN': 'Tư vấn viên',
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
               title: 'Số điện thoại',
               dataIndex: 'phoneNumber',
               key: 'phoneNumber',
               width: 130,
               render: (phone) => phone || 'Chưa cập nhật',
          },
          {
               title: 'Ngày tạo',
               dataIndex: 'createDate',
               key: 'createDate',
               width: 120,
               render: (date) => dayjs(date).format('DD/MM/YYYY'),
          },

          {
               title: 'Thao tác',
               key: 'actions',
               width: 100,
               render: (_, record) => (
                    <Tooltip title="Xem chi tiết">
                         <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              size="small"
                              onClick={() => {
                                   setSelectedUser(record);
                                   setDetailModalVisible(true);
                              }}
                         />
                    </Tooltip>
               ),
          },
     ];

     // Calculate statistics
     const stats = {
          total: Array.isArray(users) ? users.length : 0,
          members: Array.isArray(users) ? users.filter(u => u.roleId === 'MB').length : 0,
          staff: Array.isArray(users) ? users.filter(u => u.roleId === 'ST').length : 0,
          consultants: Array.isArray(users) ? users.filter(u => u.roleId === 'CN').length : 0,
          managers: Array.isArray(users) ? users.filter(u => u.roleId === 'MG').length : 0,
          active: Array.isArray(users) ? users.filter(u => u.isActive).length : 0,
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
                                   title="Thành viên"
                                   value={stats.members}
                                   prefix={<UserOutlined />}
                                   valueStyle={{ color: '#52c41a' }}
                              />
                         </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Nhân viên"
                                   value={stats.staff}
                                   prefix={<MedicineBoxOutlined />}
                                   valueStyle={{ color: '#fa8c16' }}
                              />
                         </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                         <Card>
                              <Statistic
                                   title="Đang hoạt động"
                                   value={stats.active}
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
                                   <Option value="ST">Nhân viên</Option>
                                   <Option value="CN">Tư vấn viên</Option>
                                   <Option value="MG">Quản lý</Option>
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
                    />
               </Card>

               {/* Detail Modal */}
               <Modal
                    title={
                         <Space>
                              <UserOutlined />
                              <span>Chi tiết nhân viên</span>
                         </Space>
                    }
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                         <Button key="close" onClick={() => setDetailModalVisible(false)}>
                              Đóng
                         </Button>
                    ]}
                    width={700}
               >
                    {selectedUser && (
                         <Descriptions bordered column={2}>
                              <Descriptions.Item label="Avatar" span={2}>
                                   <Avatar
                                        size={80}
                                        src={selectedUser.avatar}
                                        icon={<UserOutlined />}
                                   />
                              </Descriptions.Item>
                              <Descriptions.Item label="ID">
                                   {selectedUser.userId}
                              </Descriptions.Item>
                              <Descriptions.Item label="Vai trò">
                                   <Tag color={getRoleColor(selectedUser.roleId)}>
                                        {getRoleDisplayName(selectedUser.roleId)}
                                   </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Họ tên">
                                   {selectedUser.fullName || 'Chưa cập nhật'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Email">
                                   {selectedUser.email}
                              </Descriptions.Item>
                              <Descriptions.Item label="Số điện thoại">
                                   {selectedUser.phoneNumber || 'Chưa cập nhật'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Ngày sinh">
                                   {selectedUser.doB ? dayjs(selectedUser.doB).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Giới tính">
                                   {selectedUser.gender || 'Chưa cập nhật'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Địa chỉ" span={2}>
                                   {selectedUser.address || 'Chưa cập nhật'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Ngày tạo">
                                   {dayjs(selectedUser.createDate).format('DD/MM/YYYY')}
                              </Descriptions.Item>
                              <Descriptions.Item label="Nhà cung cấp">
                                   {selectedUser.provider}
                              </Descriptions.Item>
                              <Descriptions.Item label="Trạng thái hoạt động">
                                   <Badge
                                        status={selectedUser.isActive ? 'success' : 'error'}
                                        text={selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                   />
                              </Descriptions.Item>
                              <Descriptions.Item label="Trạng thái khả dụng">
                                   <Badge
                                        status={selectedUser.isAvailable ? 'success' : 'error'}
                                        text={selectedUser.isAvailable ? 'Khả dụng' : 'Không khả dụng'}
                                   />
                              </Descriptions.Item>
                         </Descriptions>
                    )}
               </Modal>
          </div>
     );
};

export default EmployeeManagement;