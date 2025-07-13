import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, List, Typography } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { notiApi, authApi, getInfo } from '../../services/api';
import dayjs from 'dayjs';

import AdminDashboard from '../../pages/Admin/AdminDashboard';
import UserManagement from '../../pages/Admin/UserManagement';
import Profile from '../../pages/Profile/Profile';
import Logos from '../../assets/imgs/Logos.png';
import NotificationDropdown from '../NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import './AdminLayout.css';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function AdminLayout() {
    const [selectedKey, setSelectedKey] = useState('dashboard');
    const [userInfo, setUserInfo] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const info = JSON.parse(localStorage.getItem('userInfo'));
        if (!info || info.roleId !== 'AD') {
            navigate('/login');
            return;
        }

        const userId = Cookies.get('userId');
        if (userId) {
            getInfo(userId)
                .then(res => setUserInfo(res.data))
                .catch(err => {
                    console.error('Error fetching user info:', err);
                    toast.error('Lỗi lấy thông tin người dùng');
                });
        }
    }, [navigate]);

    useEffect(() => {
        const userId = Cookies.get('userId');

        const fetchNotifications = (uid) => {
            notiApi.getNotifications(uid)
                .then(res => {
                    const sorted = res.data.sort((a, b) => new Date(b.sentTime) - new Date(a.sentTime));
                    const unread = sorted.filter(n => !n.isRead);
                    setUnreadCount(unread.length);
                    setNotifications(sorted);
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        const refreshToken = Cookies.get('refreshToken');
                        if (refreshToken) {
                            authApi.refreshToken(refreshToken).then(response => {
                                Cookies.set('token', response.data.token);
                                fetchNotifications(uid);
                            });
                        }
                    }
                });
        };

        if (userId) {
            fetchNotifications(userId);
            const interval = setInterval(() => fetchNotifications(userId), 5000);
            return () => clearInterval(interval);
        }
    }, []);

    const handleNotificationClick = async (notiId) => {
        try {
            await notiApi.markAsRead(notiId);
            setNotifications((prev) =>
                prev.map((n) => (n.notificationId === notiId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prevUnreadCount) => Math.max(0, prevUnreadCount - 1));
        } catch (err) {
            toast.error('Lỗi tải thông báo');
            console.error('Error marking notification as read: ', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notiApi.markAllAsRead(Cookies.get('userId'));
            setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            toast.error('Lỗi đánh dấu tất cả thông báo đã đọc');
            console.error('Error marking all notifications as read: ', err);
        }
    };

    const handleLogout = () => {
        Cookies.remove('email');
        Cookies.remove('userId');
        Cookies.remove('userid');
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        localStorage.removeItem('userInfo');
        navigate('/');
        window.location.reload();
    };

    const notificationItems = [
        {
            key: 'notifications',
            label: (
                <NotificationDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={handleNotificationClick}
                    onMarkAllAsRead={handleMarkAllAsRead}
                />
            )
        },
    ];

    const menuItems = [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Trang chính' },
        { key: 'users-management', icon: <UserOutlined />, label: 'Quản lý người dùng' },
        { key: 'my-profile', icon: <SettingOutlined />, label: 'Cài đặt cá nhân' },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users-management':
                return <UserManagement />;
            case 'my-profile':
                return <Profile hideBackButton={true} />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={280} className="admin-sider">
                <div className="admin-sider-top">
                    <div className="admin-logo">
                        <img src={Logos} alt="MedSex Logo" style={{ width: 50 }} />
                        <span className="logo-text">MedSex</span>
                    </div>

                                            <div className="admin-avatar-container">
                            <Avatar
                                size={80}
                                src={userInfo?.avatar || null}
                                icon={!userInfo?.avatar && <UserOutlined />}
                            />
                            <div className="admin-avatar-name">{userInfo?.fullName || "(ADMIN)"}</div>
                        </div>
                    

                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        onClick={({ key }) => setSelectedKey(key)}
                        style={{ fontSize: 16 }}
                    />
                </div>

                <div className="admin-logout-wrapper">
                <button onClick={handleLogout} className="admin-logout-button">
                    <span className="admin-logout-icon">
                    <LogoutOutlined />
                    </span>
                    <span className="admin-logout-text">Đăng xuất</span>
                </button>
                </div>
            </Sider>

            <Layout>
                <Header className="admin-header">
                    <span className="admin-header-text">Admin Dashboard</span>
                    <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
                        <Badge count={unreadCount}>
                            <FontAwesomeIcon icon={faBell} style={{ fontSize: 24, cursor: 'pointer', color: '#1890ff' }} />
                        </Badge>
                    </Dropdown>
                </Header>

                <Content className="admin-content">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
