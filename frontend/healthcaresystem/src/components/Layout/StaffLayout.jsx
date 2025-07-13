import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, List, Typography, Button } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Dashboard from '../../pages/Staff/StaffDashboard';
import StaffSchedule from '../../pages/Staff/StaffSchedule';
import TestDone from '../../pages/Staff/TestDone';
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { notiApi, authApi, getInfo } from '../../services/api';
import dayjs from 'dayjs';
import Schedule from '../Schedule/schedule';
import NotificationDropdown from '../NotificationDropdown';
import Logos from '../../assets/imgs/Logos.png';
import './StaffLayout.css';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const StaffLayout = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo'));
    if (!info || info.roleId !== 'ST') {
      navigate('/login');
      return;
    }
    // Fetch user info from API
    const userId = Cookies.get('userId');
    if (userId) {
      getInfo(userId)
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error('Error fetching user info:', err);
          setUserInfo(info); // fallback to localStorage if API fails
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    const userId = Cookies.get('userId');

    const fetchNotifications = (userId) => {
      notiApi
        .getNotifications(userId)
        .then((res) => {
          const sortedNotifications = res.data.sort((a, b) => new Date(b.sendTime) - new Date(a.sendTime));
          const newUnreadCount = sortedNotifications.filter((n) => !n.isRead).length;

          if (newUnreadCount > unreadCount) {
            const newNotifications = sortedNotifications
              .filter((n) => !n.isRead)
              .slice(0, newUnreadCount - unreadCount);
            newNotifications.forEach((noti) => {
              if (Notification.permission === 'granted') {
                new Notification(noti.title, { body: noti.content });
              }
            });
          }
          setNotifications(sortedNotifications);
          setUnreadCount(newUnreadCount);
        })
        .catch((err) => {
          console.error('Error fetching notifications:', err);
          if (err.response?.status === 401) {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
              authApi.refreshToken(refreshToken).then((response) => {
                const { token } = response.data;
                Cookies.set('token', token);
                fetchNotifications(userId);
              });
            }
          }
        });
    };

    if (userId) {
      fetchNotifications(userId);
      const pollInterval = setInterval(() => fetchNotifications(userId), 5000);
      return () => clearInterval(pollInterval);
    }
  }, [unreadCount, navigate]);

  const handleNotificationClick = async (notiId) => {
    try {
      await notiApi.markAsRead(notiId);
      setNotifications((prev) => prev.map((n) => (n.notificationId === notiId ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Notification logic giống Header.jsx
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(noti => notiApi.markAsRead(noti.notificationId)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
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
    }
  ];

  const menuItems = [
    {
      key: 'my-schedule',
      icon: <CalendarOutlined />,
      label: 'Các xét nghiệm đang thực hiện',
    },
    {
      key: 'work-schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch làm việc',
    },
    {
      key: 'my-profile',
      icon: <CalendarOutlined />,
      label: "My profile"
    }
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'my-schedule':
        return <StaffSchedule />;
      case 'work-schedule':
        return <Schedule />;
      case 'my-profile':
        return <Profile hideBackButton={true} />;
      default:
        return <StaffSchedule />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} className="staff-sider">
        <div className="staff-sider-top">
          <div className="staff-logo">
            <img src={Logos} alt="MedSex Logo" style={{ width: 50 }} />
            <span className="staff-logo-text">MedSex</span>
          </div>

          <div className="staff-avatar-container">
            <Avatar
              size={80}
              src={userInfo?.avatar || null}
              icon={!userInfo?.avatar && <UserOutlined />}
            />
            <div className="staff-avatar-name">{userInfo?.fullName || "(STAFF)"}</div>
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

        <div className="staff-logout-wrapper">
        <button onClick={() => {
          Cookies.remove('email');
          Cookies.remove('userid');
          Cookies.remove('userId');
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          localStorage.removeItem('userInfo');
          navigate('/');
          window.location.reload();
        }} className="staff-logout-button">
          <span className="staff-logout-icon">
          <FontAwesomeIcon icon={faSignOutAlt} />
          </span>
          <span className="staff-logout-text">Đăng xuất</span>
        </button>
        </div>
      </Sider>
      <Layout>
        <Header className="staff-header">
          <span className="staff-header-text">Staff Dashboard</span>
          <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
            <Badge count={unreadCount}>
              <FontAwesomeIcon icon={faBell} style={{ fontSize: 24, cursor: 'pointer', color: '#1890ff' }} />
            </Badge>
          </Dropdown>
        </Header>

        <Content className="staff-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout; 