import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Table, Tag, Avatar } from "antd";  
import {
    UserOutlined,
    TeamOutlined,
    SolutionOutlined,
    CrownOutlined,
    ExperimentOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import { adminApi } from "../../services/api";
import { toast } from "react-toastify";
import './AdminDashboard.css';
import dayjs from "dayjs";

const { Title } = Typography;

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        admins: 0,
        managers: 0,
        staff: 0,
        consultants: 0,
        members: 0, 
    });

    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminApi.getUserStats();
                setStats(res.data);
            } catch (err) {
                toast.error('Lỗi lấy thống kê người dùng')
                console.error('Lỗi lấy thống kê người dùng:', err);
            }
        };

        const fetchRecentUsers = async () => {
            try {
                const res = await adminApi.getRecentUsers();
                setRecentUsers(res.data.members);
            } catch (err) {
                toast.error('Lỗi lấy người dùng mới');
                console.error('Lỗi lấy người dùng mới:', err);
            }
        };
        fetchStats();
        fetchRecentUsers();
    }, []);

    const columns = [
        {
            title: 'Thông tin',
            key: 'info',
            width: '30%',
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
            width: '22%',
            render: (roleId) => {
                const roleMap = {
                    MB: 'Thành viên',
                    CS: 'Tư vấn viên',
                    ST: 'Nhân viên xét nghiệm',
                    AD: 'Quản trị viên',
                    MG: 'Quản lý',
                };
                const colorMap = {
                    MB: 'cyan',
                    CS: 'purple',
                    ST: 'green',
                    AD: 'volcano',
                    MG: 'geekblue',
                };
                return <Tag color={colorMap[roleId]} style={{ fontSize: 13 }}>{roleMap[roleId] || 'Không xác định'}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            width: '16%',
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
            width: '16%',
            render: (text) => text || 'Chưa cập nhật',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            width: '16%',
            render: (date) => {
                return date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa xác định';
            },
        },
    ];

    return (
        <div className="admin-dashboard">
            <Row gutter={[16, 16]} style={{ marginTop:8 }} className="statistic-card">
                <Col xs={24} sm={12} md={6}>
                    <Card className="dashboard-card admin-card">
                    <Statistic title="Quản trị viên" value={stats.admins} prefix={<CrownOutlined />} suffix="(Tài khoản)"/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="dashboard-card manager-card">
                    <Statistic title="Quản lý" value={stats.managers} prefix={<TeamOutlined />} suffix="(Tài khoản)"/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="dashboard-card staff-card">
                    <Statistic title="Nhân viên xét nghiệm" value={stats.staffs} prefix={<SolutionOutlined />} suffix="(Tài khoản)"/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="dashboard-card consultant-card">
                    <Statistic title="Tư vấn viên" value={stats.consultants} prefix={<ExperimentOutlined />} suffix="(Tài khoản)"/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="dashboard-card member-card">
                    <Statistic title="Thành viên" value={stats.members} prefix={<SmileOutlined />} suffix="(Tài khoản)"/>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Người dùng mới đăng ký"
                style={{ marginTop: 24 }}
                className="dashboard-table"
            >
                <Table 
                    bordered
                    dataSource={recentUsers}
                    columns={columns}
                    rowKey="userId"
                    pagination={{ pageSize: 5, className: 'dashboard-pagination', }}
                />
            </Card>
        </div>
    );
};

export default AdminDashboard;