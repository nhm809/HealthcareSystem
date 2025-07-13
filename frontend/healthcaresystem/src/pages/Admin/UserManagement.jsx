import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select, Row, Col, Tag, Dropdown, Space, Typography, Avatar } from 'antd';
import { 
    UserOutlined,
    ExclamationCircleOutlined,
    EllipsisOutlined,
    EditOutlined,
    InfoCircleOutlined,
    StopOutlined,
    CheckCircleOutlined
 } from '@ant-design/icons';
import { adminApi } from "../../services/api";
import UserDetailModal from './UserDetailModal';
import { toast } from "react-toastify";
import PermissionModal from './PermissionModal';
import dayjs from 'dayjs';
import './UserManagement.css';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const roleMap = {
    MB: 'Thành viên',
    CS: 'Tư vấn viên',
    ST: 'Nhân viên xét nghiệm',
    AD: 'Quản trị viên',
    MG: 'Quản lý',
};

function UserManagement() {
    const [users, setUsers] = useState();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [permissionVisible, setPermissionVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);

    const fetchUsers = async () => {
            console.log("Fetch Users With Params:", {
        page,
        pageSize,
        searchTerm,
        roleFilter,
        statusFilter
    }); // <- Thêm dòng này

        try {
            const res = await adminApi.getUsersPerPage(page, pageSize, searchTerm, roleFilter, statusFilter);
            console.log(res);
            setUsers(res.data.users);
        } catch (err) {
            toast.error('Lỗi khi tải người dùng');
            console.error('Lỗi khi tải người dùng: ', err);
        }
    };

    const fetchPageCount = async () => {
        try {
            const res = await adminApi.getPageCount(pageSize, searchTerm, roleFilter, statusFilter);
            setTotalPages(res.data.count);
        } catch (err) {
            toast.error('Lỗi khi đếm số trang');
            console.error('Lỗi khi đếm số trang: ', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchPageCount();
    }, [page, searchTerm, roleFilter, statusFilter]);

    const handleDelete = (user) => {
        confirm({
            title: `Bạn có chắc chắn muốn ${user.isAvailable ? 'vô hiệu hóa' : 'kích hoạt lại'} tài khoản này?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    await adminApi.setUserStatus(user.userId, !user.isAvailable);
                    toast.success(`${user.isAvailable ? 'Vô hiệu hóa' : 'Kích hoạt'} thành công`);
                    fetchUsers();
                } catch (err) {
                    toast.error('Thao tác thất bại');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Thông tin',
            key: 'info',
            width: '27%',
            render: (_, user) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{user.fullName || '(Người dùng)'}</div>
                        <div style={{ color: '#888' }}>{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleId',
            key: 'roleId',
            width: '18%',
            render: (roleId) => {
                const colorMap = {
                    MB: 'cyan',
                    CS: 'purple',
                    ST: 'green',
                    AD: 'volcano',
                    MG: 'geekblue',
                };
                return <Tag color={colorMap[roleId]} style={{ fontSize: 13}}>{roleMap[roleId] || 'Không xác định'}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            width: '15%',
            render: (isAvailable) => (
                <Tag color={isAvailable ? 'green' : 'red'} style={{ fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10 }}>●</span>
                        {isAvailable ? 'Khả dụng' : 'Đã khóa'}
                    </span>
                </Tag>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '15%',
            render: (text) => text || 'Chưa cập nhật',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            width: '15%',
            render: (date) => {
                return date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa xác định';
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '10%',
            render: (_, user) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <InfoCircleOutlined />,
                        onClick: () => {
                            setSelectedUser(user);
                            setDetailVisible(true);
                        },
                    },
                    ...(user.roleId !== 'AD'
                        ? [{
                            key: 'permission',
                            label: 'Phân quyền',
                            icon: <EditOutlined />,
                            onClick: () => {
                                setSelectedUser(user);
                                setPermissionVisible(true);
                            },
                        }]
                        : []
                    ),
                    {
                        key: 'toggle',
                        label: user.isAvailable ? 'Vô hiệu hoá' : 'Kích hoạt',
                        icon: user.isAvailable ? <StopOutlined /> : <CheckCircleOutlined />,
                        danger: user.isAvailable,
                        onClick: () => handleDelete(user),
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<EllipsisOutlined />} />
                    </Dropdown>
                );
            },
        }
    ];

    return (
        <div className="user-management" style={{ padding: '8px 32px 8px 32px' }}>
            <Row gutter={16} style={{ marginBottom: 20 }} justify="end">
                <Col span={6}>
                    <Search
                        placeholder="Tìm kiếm theo tên hoặc email"
                        enterButton="Tìm"
                        allowClear
                        onSearch={(value) => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </Col>
                <Col span={4}>
                    <Select
                        allowClear
                        placeholder="Lọc theo trạng thái"
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            console.log("Trạng thái được chọn:", value); // DEBUG
                            setStatusFilter(value);
                            setPage(1);
                        }}
                    >
                        <Option value={true}>Khả dụng</Option>
                        <Option value={false}>Đã khóa</Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Select
                        allowClear
                        placeholder="Lọc theo vai trò"
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            setRoleFilter(value);
                            setPage(1);
                        }}
                    >
                        {Object.entries(roleMap).map(([key, label]) => (
                            <Option key={key} value={key}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey="userId"
                pagination={{
                    current: page,
                    total: totalPages * pageSize,
                    pageSize,
                    onChange: (page) => setPage(page),
                    className:"management-pagination",
                }}
            />
            {/* Modal Chi tiết */}
            <UserDetailModal
                open={detailVisible}
                userId={selectedUser?.userId}
                onClose={() => setDetailVisible(false)}
            />

            <PermissionModal
                open={permissionVisible}
                onClose={() => setPermissionVisible(false)}
                user={selectedUser}
                onSubmit={async (userId, newRole) => {
                    try {
                        await adminApi.updateUser({
                            userId, 
                            roleId: newRole
                        })
                        toast.success('Cập nhật vai trò thành công');
                        fetchUsers();
                    } catch (err) {
                        console.error('Cập nhật vai trò thất bại: ', err)
                        toast.error('Cập nhật vai trò thất bại');
                    }
                }}
            />
        </div>
    );
};

export default UserManagement;